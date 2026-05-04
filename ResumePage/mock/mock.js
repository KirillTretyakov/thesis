export const MOCK_DATA = {
    "selectedResume": {
        "title": "Data Analyst",
        "experienceYears": 3,
        "location": "Москва",
        "skills": [
            "Python",
            "SQL",
            "Pandas",
            "Machine Learning",
            "Statistics"
        ]
    },
    "filters": {
        "experienceYears": {
            "min": 0,
            "max": 10
        },
        "skills": [
            {
                "name": "Написание отчетов",
                "experienceRange": "2-4 года"
            }
        ],
        "weights": {
            "semantics": 0.76,
            "skills": 0.85,
            "experience": 0.90
        }
    },
    "metrics": {
        "goodMatchRateAt5": 0.68,
        "experienceFitRateAt5": 0.72,
        "meanSemanticScoreAt5": 0.71
    },
    "topVacancies": [
        {
            "id": 1,
            "title": "Data Analyst",
            "company": "Яндекс",
            "city": "Москва",
            "format": "офис",
            "requiredExperience": "2-4 года",
            "scores": {
                "semantics": 0.83,
                "skills": 0.85,
                "experience": 0.90,
                "total": 0.83
            }
        },
        {
            "id": 2,
            "title": "Junior Data Analyst",
            "company": "Сбер",
            "city": "Москва",
            "format": "гибрид",
            "requiredExperience": "1-3 года",
            "scores": {
                "semantics": 0.76,
                "skills": 0.80,
                "experience": 0.75,
                "total": null
            }
        },
        {
            "id": 3,
            "title": "BI Analyst",
            "company": "Тинькофф",
            "city": "Москва",
            "format": "офис",
            "requiredExperience": "2-3 года",
            "scores": {
                "semantics": 0.72,
                "skills": 0.75,
                "experience": 0.72,
                "total": null
            }
        },
        {
            "id": 4,
            "title": "Data Engineer",
            "company": "Контур",
            "city": "Москва",
            "format": "офис",
            "requiredExperience": "3-5 лет",
            "scores": {
                "semantics": 0.64,
                "skills": 0.60,
                "experience": 0.70,
                "total": null
            }
        },
        {
            "id": 5,
            "title": "ML Analyst",
            "company": "Ozon",
            "city": "Москва",
            "format": "гибрид",
            "requiredExperience": "2-4 года",
            "scores": {
                "semantics": 0.58,
                "skills": 0.55,
                "experience": 0.60,
                "total": null
            }
        }
    ],
    "vacancyDetails": {
        "title": "Data Analyst",
        "totalScore": 0.83,
        "company": "Яндекс",
        "city": "Москва",
        "format": "офис",
        "requiredExperience": "2-4 года",
        "candidateExperience": 3,
        "skillMatch": {
            "match": ["Python", "SQL", "Pandas", "Machine Learning", "Statistics"],
            "partial": ["NumPy", "Data Analysis", "Excel", "Data Visualization"],
            "missing": ["Git"]
        },
        "allResumeSkills": [
            "Python",
            "SQL",
            "Pandas",
            "NumPy",
            "Data Analysis",
            "Machine Learning",
            "Statistics",
            "Excel",
            "Data Visualization",
            "Git"
        ]
    }
}
