from pydantic import BaseModel

# selectedResume
class SelectedResume(BaseModel):
    title: str
    experienceYears: int
    location: str 
    skills: list


# filters
# Возможно, стоит удалить 
class Weights(BaseModel):
    semantics: float
    skills: float 
    experience: float
    

class Skills(BaseModel):
    name: str
    experienceRange: str


class ExperienceYears(BaseModel):
    min: int
    max: int


class Filters(BaseModel):
    experienceYears: ExperienceYears
    skills: Skills
    weights: Weights


# metrics
class Metrics(BaseModel):
    goodMatchRateAt5: float
    experienceFitRateAt5: float 
    meanSemanticScoreAt5: float


# vacancyDetails
class SkillMatch(BaseModel):
    match: list
    partial: list
    missing: list



class VacancyDetails(BaseModel):
    title: str
    totalScore: float
    company: str
    city: str 
    format: str 
    requiredExperience: str
    candidateExperience: float
    skillMatch: SkillMatch
    allResumeSkills: list

    # продумать пустые поля
