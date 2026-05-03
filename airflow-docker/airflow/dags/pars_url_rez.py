from datetime import datetime
import time
import pendulum
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from psycopg2.extras import execute_values
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service


def read_one_specialty():
    hook = PostgresHook(postgres_conn_id="thesis_db")
    sql = """
        SELECT id, vacancy_name, last_used_at, area_id
        FROM tech.specialties
        ORDER BY last_used_at NULLS FIRST, id
        LIMIT 1
        """
    records = hook.get_records(sql)
    specialty = records[0]
    print(specialty)
    return specialty

def get_resume_links(driver):
    links = []
    for a in driver.find_elements(By.CSS_SELECTOR, "a[href*='/resume/']"):
        href = a.get_attribute("href")
        if href:
            links.append(href)
    return list(dict.fromkeys(links))

def scroll_into_view(driver, el):
    driver.execute_script("arguments[0].scrollIntoView({block:'center'});", el)
    time.sleep(0.2)

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

def parse_specialty(**context):
    ti = context["ti"]
    specialty = ti.xcom_pull(task_ids="read_one_specialty")
    specialty_id = specialty[0]
    query = specialty[1]
    area_id = specialty[3]
    url = f"https://hh.ru/search/resume{'?area='+str(area_id) if area_id>0 else ''}"
    max_pages = 50
    print(f"Парсинг {specialty_id} {query}")
    driver = make_driver()
    wait = WebDriverWait(driver, 25)
    all_links = []
    prev_first = None
    try:
        driver.get(url)
        inp = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "input#a11y-search-input"))
        )
        inp.clear()
        inp.send_keys(query)
        find_btn = wait.until(
            EC.element_to_be_clickable((
                By.XPATH,
                "//button[.//span[normalize-space()='Найти'] or normalize-space()='Найти']"
            ))
        )
        driver.execute_script("arguments[0].click();", find_btn)
        wait.until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "a[href*='/resume/']"))
        )
        for page_idx in range(max_pages):
            page_links = get_resume_links(driver)
            if not page_links:
                print("Пусто, стоп")
                break
            first = page_links[0]
            if first == prev_first:
                print("Выдача повторяется, стоп")
                break
            prev_first = first
            all_links.extend(page_links)
            all_links = list(dict.fromkeys(all_links))
            print(f"page~{page_idx}: +{len(page_links)} (total={len(all_links)})")
            first_el = driver.find_element(By.CSS_SELECTOR, "a[href*='/resume/']")
            try:
                next_btn = wait.until(
                    EC.presence_of_element_located(
                        (By.CSS_SELECTOR, 'a[data-qa="pager-next"]')
                    )
                )
            except TimeoutException:
                print("pager-next не найден, стоп")
                break
            scroll_into_view(driver, next_btn)
            aria_disabled = (next_btn.get_attribute("aria-disabled") or "").lower()
            if aria_disabled == "true":
                print("Следующая страница недоступна, стоп")
                break
            wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, 'a[data-qa="pager-next"]'))
            )
            driver.execute_script("arguments[0].click();", next_btn)
            try:
                wait.until(EC.staleness_of(first_el))
            except TimeoutException:
                try:
                    wait.until(lambda d: get_resume_links(d)[:1] != [prev_first])
                except TimeoutException:
                    print("После клика выдача не обновилась, стоп")
                    break
        result = {
            "specialty_id": specialty_id,
            "query": query,
            "links": all_links,
            "links_count": len(all_links),
        }
        print(f"TOTAL UNIQUE: {len(all_links)}")
        return result
    finally:
        driver.quit()

def save_resume_links(**context):
    ti = context["ti"]
    parse_result = ti.xcom_pull(task_ids="parse_specialty")
    if not parse_result:
        print("Нет результата парсинга")
        return None
    specialty_id = parse_result["specialty_id"]
    query = parse_result["query"]
    links = parse_result["links"]

    if not links:
        print(f"Для specialty_id={specialty_id} ссылок нет")
        return {
            "specialty_id": specialty_id,
            "query": query,
            "links_count": 0,
            "inserted_count": 0,
        }
    hook = PostgresHook(postgres_conn_id="thesis_db")
    conn = hook.get_conn()
    inserted_count = 0
    with conn, conn.cursor() as cur:
        execute_values(
            cur,
            """
            INSERT INTO hh_resume_urls (url)
            VALUES %s
            ON CONFLICT (url) DO NOTHING
            """,
            [(u,) for u in links],
        )
        inserted_count = cur.rowcount

    print(f"{specialty_id}")
    print(f"{query}")
    print(f"Новых ссылок {len(links)}")
    print(f"Вставлено {inserted_count}")
    return {
        "specialty_id": specialty_id,
        "query": query,
        "links_count": len(links),
        "inserted_count": inserted_count,
    }

def update_specialty(**context):
    ti = context["ti"]
    save_result = ti.xcom_pull(task_ids="save_resume_links")
    specialty_id = save_result["specialty_id"]
    inserted_count = save_result["inserted_count"]
    hook = PostgresHook(postgres_conn_id="thesis_db")
    sql = """
        UPDATE tech.specialties
        SET
            last_used_at = NOW(),
            area_id = COALESCE(area_id, 0) + 1,
            total_parsed_new_count = %s
        WHERE id = %s
        """
    hook.run(sql, parameters=(inserted_count, specialty_id))
    print(
        f"Обновлена specialties.id={specialty_id}: "
        f"last_used_at=NOW(), area_id+1, total_parsed_new_count={inserted_count}"
    )
    return {
        "specialty_id": specialty_id,
        "inserted_count": inserted_count,
    }

moscow_tz = pendulum.timezone("Europe/Moscow")

with DAG(
    dag_id="pars_url_rez",
    start_date=datetime(2026, 3, 31, 1, 40, tzinfo=moscow_tz),
    schedule="40 1/2 * * *",
    catchup=False,
    tags=["rez"],
) as dag:
    read_specialty_task = PythonOperator(
        task_id="read_one_specialty",
        python_callable=read_one_specialty,
    )
    parse_specialty_task = PythonOperator(
        task_id="parse_specialty",
        python_callable=parse_specialty,
    )
    save_resume_links_task = PythonOperator(
        task_id="save_resume_links",
        python_callable=save_resume_links,
    )
    update_specialty_task = PythonOperator(
        task_id="update_specialty",
        python_callable=update_specialty,
    )
    read_specialty_task >> parse_specialty_task >> save_resume_links_task >> update_specialty_task