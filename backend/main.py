from fastapi import FastAPI
from models import ResumeModel
from script import get_top_vacancies

app = FastAPI()

@app.post('/get_data')
def get_data(request: ResumeModel):

    raw_resume = request.resume_text
    try:
        result = get_top_vacancies(raw_resume)
        return result
    except Exception as e:
        print(e)
        return {'status': 'error',
                'error_code': 600,
                'error_text': 'Internal Server Error'}

    