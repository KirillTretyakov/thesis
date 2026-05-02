FROM apache/airflow:2.8.3-python3.10

USER root

RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    libnss3 \
    libgbm1 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libxss1 \
    libasound2 \
    libu2f-udev \
    libvulkan1 \
    fonts-liberation \
    xdg-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /requirements.txt

ENV AIRFLOW_HOME=/opt/airflow
ENV AIRFLOW__CORE__EXECUTOR=LocalExecutor
ENV AIRFLOW__CORE__LOAD_EXAMPLES=False
ENV AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow_user:2001@158.160.145.30:5432/airflow_db?sslmode=disable
ENV AIRFLOW__CORE__DAGS_FOLDER=/opt/airflow/dags
ENV AIRFLOW__CORE__PLUGINS_FOLDER=/opt/airflow/plugins

USER airflow

RUN pip install --no-cache-dir -r /requirements.txt

RUN pip install --no-cache-dir \
    airflow-code-editor \
    black \
    fs-s3fs \
    fs-gcsfs

COPY --chmod=755 scripts/init.sh /init.sh
ENTRYPOINT ["/init.sh"]