#!/bin/bash

# Создание БД (инициализация метаданных Airflow)
sleep 10
airflow db migrate   # можно оставить airflow db init, но migrate обычно лучше
sleep 10

# Создание пользователя (лучше явный флаг --password)
airflow users create \
  --username admin \
  --firstname admin \
  --lastname admin \
  --role Admin \
  --email admin@example.org \
  --password 12345

# Запуск шедулера и вебсервера
airflow scheduler & airflow webserver
