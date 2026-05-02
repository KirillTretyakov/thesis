from datetime import datetime, timedelta
import time
import random
import pendulum
from urllib.parse import urlencode
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from psycopg2.extras import execute_values
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

BASE_URL = "https://hh.ru/search/vacancy"
MAX_PAGES = 10

def make_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")
    options.binary_location = "/usr/bin/chromium"
    service = Service("/usr/bin/chromedriver")
    return webdriver.Chrome(service=service, options=options)

def build_url(vacancy_name, area_id=None):
    params = {"text": vacancy_name}
    if area_id is not None and area_id > 0:
        params["area"] = area_id
    return f"{BASE_URL}?{urlencode(params)}"

def get_vacancy_links(driver):
    links = []
    for a in driver.find_elements(By.CSS_SELECTOR, "a[href*='/vacancy/']"):
        href = a.get_attribute("href")
        if href:
            href = href.split("?")[0]
            links.append(href)
    return list(dict.fromkeys(links))

def get_all_specialties():
    hook = PostgresHook(postgres_conn_id="thesis_db")
    sql = """
        SELECT id, vacancy_name, area_id
        FROM tech.specialties
        ORDER BY id
        """
    return hook.get_records(sql)

def save_links(links):
    if not links:
        return 0
    hook = PostgresHook(postgres_conn_id="thesis_db")
    conn = hook.get_conn()
    with conn, conn.cursor() as cur:
        execute_values(
            cur,
            """
            INSERT INTO hh_vacancy_urls (url)
            VALUES %s
            ON CONFLICT (url) DO NOTHING
            """,
            [(link,) for link in links]
        )
        inserted_count = cur.rowcount
    return inserted_count

def update_specialty_stats(specialty_id, inserted_count):
    hook = PostgresHook(postgres_conn_id="thesis_db")
    sql = """
        UPDATE tech.specialties
        SET
            last_used_at = NOW(),
            total_parsed_new_count = COALESCE(total_parsed_new_count, 0) + %s
        WHERE id = %s
        """
    hook.run(sql, parameters=(inserted_count, specialty_id))


def parse_one_specialty(driver, wait, vacancy_name, area_id):
    url = build_url(vacancy_name, area_id)
    print(f"пошел {url}")
    driver.get(url)
    try:
        wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "a[href*='/vacancy/']")
            )
        )
    except TimeoutException:
        print(f"не найден {vacancy_name}")
        return []
    all_links = []
    prev_first_link = None
    for page in range(MAX_PAGES):
        links = get_vacancy_links(driver)
        if not links:
            break
        first_link = links[0]
        if first_link == prev_first_link:
            break
        prev_first_link = first_link
        all_links.extend(links)
        all_links = list(dict.fromkeys(all_links))
        print(f"{vacancy_name}: страница {page + 1}, всего ссылок: {len(all_links)}")
        try:
            next_button = wait.until(
                EC.presence_of_element_located(
                    (By.CSS_SELECTOR, 'a[data-qa="pager-next"]')
                )
            )
        except TimeoutException:
            break
        if (next_button.get_attribute("aria-disabled") or "").lower() == "true":
            break
        driver.execute_script(
            "arguments[0].scrollIntoView({block:'center'});",
            next_button
        )
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", next_button)
        time.sleep(random.uniform(1.0, 2.0))
    return all_links

def parse_all_vacancies():
    specialties = get_all_specialties()
    if not specialties:
        print("В таблице tech.specialties нет данных")
        return
    driver = make_driver()
    wait = WebDriverWait(driver, 25)
    total_found = 0
    total_inserted = 0
    try:
        for specialty_id, vacancy_name, area_id in specialties:
            print("=" * 80)
            print(f"Парсим: id={specialty_id}, vacancy_name={vacancy_name}, area_id={area_id}")
            try:
                links = parse_one_specialty(
                    driver=driver,
                    wait=wait,
                    vacancy_name=vacancy_name,
                    area_id=area_id
                )
                inserted_count = save_links(links)
                update_specialty_stats(specialty_id, inserted_count)
                total_found += len(links)
                total_inserted += inserted_count
                print(f"Всего {len(links)}")
                print(f"Новые {inserted_count}")
            except Exception as e:
                print(f"ошибка {vacancy_name}: {repr(e)}")
            time.sleep(random.uniform(2.0, 5.0))
    finally:
        driver.quit()

moscow_tz = pendulum.timezone("Europe/Moscow")

with DAG(
    dag_id="pars_url_vac",
    start_date=datetime(2026, 3, 31, 1, 10, tzinfo=moscow_tz),
    schedule="10 */2 * * *",
    catchup=False,
    max_active_runs=1,
    tags=["vacancy"],
) as dag:
    parse_vacancy_urls_task = PythonOperator(
        task_id="parse_vacancy_urls",
        python_callable=parse_all_vacancies,
        pool="selenium_pool",
        execution_timeout=timedelta(minutes=90),
    )
    parse_vacancy_urls_task