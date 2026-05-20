from sshtunnel import SSHTunnelForwarder
import psycopg2
import pandas as pd

SSH_HOST = "158.160.223.108"
SSH_PORT = 22
SSH_USER = "kirill_tretyakov"
SSH_KEY_PATH = "id_ed25519"

DB_HOST = "localhost" 
DB_PORT = 5432
DB_NAME = "thesis_db"
DB_USER = "thesis"
DB_PASSWORD = "2001"

with SSHTunnelForwarder(
    (SSH_HOST, SSH_PORT),
    ssh_username=SSH_USER,
    ssh_pkey=SSH_KEY_PATH,
    remote_bind_address=(DB_HOST, DB_PORT),
    local_bind_address=("localhost", 5433)
) as tunnel:

    conn = psycopg2.connect(
        host="localhost",
        port=5433,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

    query = """
    SELECT *
    FROM public.hh_resume_urls
    LIMIT 10;
    """

    df = pd.read_sql(query, conn)

    conn.close()

print(df)