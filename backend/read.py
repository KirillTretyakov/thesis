from pypdf import PdfReader
from extract import extract_exp, extract_skills
from cleaner import clean_resume_text

# Чтение
reader = PdfReader("data/example.pdf")

text = ""

for page in reader.pages:
    text += page.extract_text() + "\n"

print(text)
print(extract_exp(text))
print(extract_skills(text))
print(clean_resume_text(text))
clean_text = clean_resume_text(text)

with open("clean_resume.txt", "w", encoding="utf-8") as file:
    file.write(clean_text)