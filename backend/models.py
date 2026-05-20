from pydantic import BaseModel

class ResumeModel(BaseModel):
    resume_text: str