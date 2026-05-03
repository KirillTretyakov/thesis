from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

def calc():
    print("1+1 =", 1 + 1)

with DAG(
    dag_id="test",
    start_date=datetime(2024, 1, 1),
    schedule=None,
    catchup=False,
) as dag:
    PythonOperator(
        task_id="print_1_plus_1",
        python_callable=calc,
    )
