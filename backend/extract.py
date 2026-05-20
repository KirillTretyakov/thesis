import re

def extract_exp(text):
    text = str(text).lower().replace("\xa0", " ")
    pattern = (
        r"опыт работы\s*[—–-]\s*"
        r"(?:(?P<years>\d+)\s*(?:лет|года|год))?"
        r"\s*"
        r"(?:(?P<months>\d+)\s*(?:месяцев|месяца|месяц))?"
    )
    match = re.search(pattern, text, flags=re.IGNORECASE)
    if match:
        years = int(match.group(1)) if match.group(1) else 0
        months = int(match.group(2)) if match.group(2) else 0

        print(years)
        print(months)
        return round(years + months / 12, 2)
    

def extract_skills(text):
    text = str(text)

    # ищем последнее слово "Навыки"
    matches = list(re.finditer(r'\bНавыки\b', text, flags=re.IGNORECASE))

    if not matches:
        return ""

    last_match = matches[-1]

    # берем все после последнего "Навыки"
    block = text[last_match.end():].strip()

    # разбиваем на строки
    lines = block.splitlines()

    # убираем пустые строки
    lines = [line.strip() for line in lines if line.strip()]

    # отбрасываем последнюю строку
    if lines:
        lines = lines[:-1]

    text_skills = "\n".join(lines).replace('\n', '      ')
    list_skills = text_skills.split('      ')

    return list_skills

