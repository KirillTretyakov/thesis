from datetime import datetime, timedelta
import time
import random
import pendulum
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SELENIUM_WAIT_SEC = 15
BATCH_SIZE = 350

def make_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")
    options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )
    options.binary_location = "/usr/bin/chromium"
    service = Service("/usr/bin/chromedriver")
    driver = webdriver.Chrome(service=service, options=options)
    wait = WebDriverWait(driver, SELENIUM_WAIT_SEC)
    return driver, wait


def expand_vacancy_description_if_exists(driver):
    buttons = driver.find_elements(
        By.XPATH,
        "//button[contains(., 'Показать описание вакансии')]"
    )
    if not buttons:
        return
    button = buttons[0]
    driver.execute_script(
        "arguments[0].scrollIntoView({block:'center'});",
        button
    )
    time.sleep(random.uniform(0.4, 0.8))
    driver.execute_script("arguments[0].click();", button)
    time.sleep(random.uniform(0.8, 1.4))


def human_scroll_to_bottom(
    driver,
    wait,
    step_px=900,
    min_sleep=0.35,
    max_sleep=0.9,
    max_rounds=80
):
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    last_height = driver.execute_script("return document.body.scrollHeight;")
    same_height_count = 0
    for _ in range(max_rounds):
        driver.execute_script(f"window.scrollBy(0, {step_px});")
        time.sleep(random.uniform(min_sleep, max_sleep))
        new_height = driver.execute_script("return document.body.scrollHeight;")
        if new_height == last_height:
            same_height_count += 1
        else:
            same_height_count = 0
            last_height = new_height
        if same_height_count >= 3:
            break


def fetch_one_new_url(conn):
    sql = """
        SELECT id, url
        FROM hh_urls_vacancies
        WHERE status = 'new'
        ORDER BY id
        LIMIT 1;
    """
    with conn.cursor() as cur:
        cur.execute(sql)
        return cur.fetchone()


def set_url_status(conn, url_id, status):
    sql = """
        UPDATE hh_urls_vacancies
        SET status = %s
        WHERE id = %s;
    """
    with conn.cursor() as cur:
        cur.execute(sql, (status, url_id))


def save_vacancy_data(conn, url, header_text, wrapper_text):
    sql = """
        INSERT INTO vacancies (vacancy_url, header_text, wrapper_text)
        VALUES (%s, %s, %s)
        ON CONFLICT (vacancy_url) DO UPDATE SET
            header_text = EXCLUDED.header_text,
            wrapper_text = EXCLUDED.wrapper_text,
            updated_at = now();
    """

    with conn.cursor() as cur:
        cur.execute(sql, (url, header_text, wrapper_text))

def parse_vacancy_page(driver, wait, url):
    driver.get(url)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
    time.sleep(random.uniform(1.0, 1.8))
    expand_vacancy_description_if_exists(driver)
    human_scroll_to_bottom(driver, wait)
    h1 = wait.until(
        EC.presence_of_element_located((By.TAG_NAME, "h1"))
    )
    header_el = h1.find_element(
        By.XPATH,
        "./ancestor::div[contains(@class, 'magritte-card')][1]"
    )
    wrapper_el = wait.until(
        EC.presence_of_element_located(
            (By.CLASS_NAME, "vacancy-description")
        )
    )
    header_text = header_el.text.strip()
    wrapper_text = wrapper_el.text.strip()
    return header_text, wrapper_text


def process_batch():
    hook = PostgresHook(postgres_conn_id="thesis_db")
    driver, wait = make_driver()
    processed_count = 0
    ok_count = 0
    error_count = 0
    try:
        for _ in range(BATCH_SIZE):
            conn = hook.get_conn()
            conn.autocommit = False
            try:
                with conn:
                    row = fetch_one_new_url(conn)
                if not row:
                    print("Новых ссылок больше нет.")
                    break
                url_id, url = row
                print(f"Взяли в работу: id={url_id}, url={url}")
                try:
                    header_text, wrapper_text = parse_vacancy_page(
                        driver=driver,
                        wait=wait,
                        url=url
                    )
                except Exception as e:
                    with conn:
                        set_url_status(conn, url_id, "error")
                    error_count += 1
                    processed_count += 1
                    print(f"ERROR: id={url_id}, url={url}, error={repr(e)}")
                    time.sleep(random.uniform(2.0, 5.0))
                    continue
                with conn:
                    save_vacancy_data(
                        conn=conn,
                        url=url,
                        header_text=header_text,
                        wrapper_text=wrapper_text
                    )
                    set_url_status(conn, url_id, "ok")
                ok_count += 1
                processed_count += 1
                print(
                    f"OK: id={url_id}, url={url}, "
                    f"header_len={len(header_text)}, "
                    f"wrapper_len={len(wrapper_text)}"
                )
                time.sleep(random.uniform(2.0, 5.0))
            finally:
                conn.close()
    finally:
        driver.quit()
    print(
        f"Получилось {processed_count}, "
        f"окей {ok_count}, неокей {error_count}"
    )

moscow_tz = pendulum.timezone("Europe/Moscow")

with DAG(
    dag_id="pars_text_vac",
    start_date=datetime(2026, 3, 31, 3, 20, tzinfo=moscow_tz),
    schedule="20 3/2 * * *",
    catchup=False,
    max_active_runs=1,
    tags=["vacancy"],
) as dag:

    parse_vacancy_text_task = PythonOperator(
        task_id="parse_vacancy_text_batch",
        python_callable=process_batch,
        pool="selenium_pool",
        execution_timeout=timedelta(minutes=75),
    )