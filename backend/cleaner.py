import re

def clean_resume_text(text):
    text = str(text)

    # Удаление до строки "Тип занятости: ..." включительно
    text = re.sub(
        r"^.*?тип занятости\s*:.*?\n",
        " ",
        text,
        flags=re.IGNORECASE | re.DOTALL
    )

    # Удаление строки "Опыт работы ..." с годами и/или месяцами
    text = re.sub(
        r"опыт работы\s*[—–-]?\s*"
        r"(?:(?:\d+)\s+(?:года|год|лет)\s*)?"
        r"(?:(?:\d+)\s+(?:месяцев|месяца|месяц)\s*)?",
        " ",
        text,
        flags=re.IGNORECASE
    )

    # Удаление после "Гражданство, время в пути до работы"
    text = re.sub(
        r"гражданство,\s*время в пути до работы.*$",
        " ",
        text,
        flags=re.IGNORECASE | re.DOTALL
    )

    # Удаление "Показать еще"
    text = re.sub(
        r"показать\s+еще",
        " ",
        text,
        flags=re.IGNORECASE
    )

    # Удаление длительности работы: "1 год 6 месяцев", "3 года", "11 месяцев"
    text = re.sub(
        r"\b\d+\s+(?:года|год|лет)\s*(?:\d+\s+(?:месяцев|месяца|месяц))?\b"
        r"|\b\d+\s+(?:месяцев|месяца|месяц)\b",
        " ",
        text,
        flags=re.IGNORECASE
    )

    # Общая очистка
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)
    text = re.sub(r"\b\S+@\S+\.\S+\b", " ", text)
    text = re.sub(r"[^a-zа-яё0-9+#.\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text