from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.operators.python import PythonOperator
from datetime import datetime

def check_urls():
    hook = PostgresHook(postgres_conn_id="thesis_db")
    n = hook.get_first("select count(*) from hh_urls")[0]
    print("urls:", n)

with DAG(
    dag_id="check_thesis_db",
    start_date=datetime(2024, 1, 1),
    schedule=None,
    catchup=False,
) as dag:
    PythonOperator(task_id="check", python_callable=check_urls)
