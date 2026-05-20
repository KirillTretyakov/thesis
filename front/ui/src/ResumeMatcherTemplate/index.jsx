import React, { useMemo, useState } from "react";
import "./styles.css";

const resume = {
  title: "Data Analyst",
  experience: "3 года",
  location: "Москва",
  skills: ["Python", "SQL", "Pandas", "Machine Learning", "Statistics"],
};

const vacancies = [
  {
    id: 1,
    title: "Data Analyst",
    company: "Яндекс",
    location: "Москва, офис",
    requiredExperience: "2–4 года",
    score: 0.83,
    semantic: 0.76,
    skills: 0.85,
    experience: 0.9,
    requiredSkills: [
      "Python",
      "SQL",
      "Pandas",
      "Machine Learning",
      "Statistics",
      "NumPy",
      "Data Analysis",
      "Excel",
    ],
  },
  {
    id: 2,
    title: "Junior Data Analyst",
    company: "Сбер",
    location: "Москва, гибрид",
    requiredExperience: "1–3 года",
    score: 0.76,
    semantic: 0.76,
    skills: 0.8,
    experience: 0.75,
    requiredSkills: [
      "Python",
      "SQL",
      "Pandas",
      "NumPy",
      "Excel",
      "Data Visualization",
    ],
  },
  {
    id: 3,
    title: "BI Analyst",
    company: "Тинькофф",
    location: "Москва, офис",
    requiredExperience: "2–3 года",
    score: 0.72,
    semantic: 0.68,
    skills: 0.75,
    experience: 0.72,
    requiredSkills: [
      "SQL",
      "Excel",
      "Python",
      "Data Analysis",
      "Power BI",
      "Statistics",
    ],
  },
  {
    id: 4,
    title: "Data Engineer",
    company: "Контур",
    location: "Москва, офис",
    requiredExperience: "3–5 года",
    score: 0.64,
    semantic: 0.62,
    skills: 0.6,
    experience: 0.7,
    requiredSkills: ["Python", "SQL", "ETL", "Airflow", "PostgreSQL", "Docker"],
  },
  {
    id: 5,
    title: "ML Analyst",
    company: "Ozon",
    location: "Москва, гибрид",
    requiredExperience: "2–4 года",
    score: 0.58,
    semantic: 0.6,
    skills: 0.55,
    experience: 0.6,
    requiredSkills: [
      "Python",
      "Machine Learning",
      "Statistics",
      "Pandas",
      "A/B tests",
      "Git",
    ],
  },
];

function formatScore(value) {
  return value.toFixed(2);
}

function SkillPill({ skill, type = "neutral" }) {
  return <span className={`skill-pill skill-pill--${type}`}>{skill}</span>;
}

function ScoreBar({ label, value, type }) {
  return (
    <div className="score-bar">
      <span className="score-bar__label">{label}</span>

      <div className="score-bar__track">
        <div
          className={`score-bar__fill score-bar__fill--${type}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>

      <span className="score-bar__value">{formatScore(value)}</span>
    </div>
  );
}

function SelectedResume() {
  return (
    <section className="selected-resume card">
      <div className="card__header">
        <h2>Выбранное резюме</h2>
      </div>

      <div className="selected-resume__content">
        <div className="selected-resume__main">
          <h3>{resume.title}</h3>
          <p>Опыт работы: {resume.experience}</p>
        </div>

        <div className="selected-resume__divider" />

        <div className="selected-resume__skills">
          <p>Навыки:</p>

          <div className="skills-list">
            {resume.skills.map((skill) => (
              <SkillPill key={skill} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VacancyCard({ vacancy, active, onClick }) {
  return (
    <button
      type="button"
      className={`vacancy-card card ${active ? "vacancy-card--active" : ""}`}
      onClick={onClick}
    >
      <div className="vacancy-card__rank">{vacancy.id}</div>

      <div className="vacancy-card__info">
        <h3>{vacancy.title}</h3>
        <p>Требуемый опыт: {vacancy.requiredExperience}</p>
      </div>

      <div className="vacancy-card__score">{formatScore(vacancy.score)}</div>

      <div className="vacancy-card__metrics">
        <ScoreBar label="Семантика" value={vacancy.semantic} type="semantic" />
        <ScoreBar label="Навыки" value={vacancy.skills} type="skills" />
        <ScoreBar label="Опыт" value={vacancy.experience} type="experience" />
      </div>

      <div className="vacancy-card__arrow">›</div>
    </button>
  );
}

function VacancyDetails({ vacancy }) {
  const resumeSkills = useMemo(() => new Set(resume.skills), []);

  return (
    <aside className="details-panel">
      <div className="details-panel__header">
        <h2>Детали совпадения</h2>
        <button className="details-panel__close">×</button>
      </div>

      <div className="details-panel__title-row">
        <div>
          <h3>{vacancy.title}</h3>
        </div>

        <div className="details-panel__total">
          <strong>{formatScore(vacancy.score)}</strong>
          <span>Итоговый скор</span>
        </div>
      </div>

      <div className="details-panel__scores">
        <div className="score-box">
          <span>Семантика</span>
          <strong className="score-box--semantic">
            {formatScore(vacancy.semantic)}
          </strong>
        </div>

        <div className="score-box">
          <span>Навыки</span>
          <strong className="score-box--skills">
            {formatScore(vacancy.skills)}
          </strong>
        </div>

        <div className="score-box">
          <span>Опыт</span>
          <strong className="score-box--experience">
            {formatScore(vacancy.experience)}
          </strong>
        </div>
      </div>

      <section className="details-section">
        <h3>Навыки</h3>

        <div className="legend">
          <span>
            <i className="legend__dot legend__dot--match" />
            Совпадает
          </span>
          <span>
            <i className="legend__dot legend__dot--missing" />
            Отсутствует
          </span>
        </div>

        <div className="skills-columns">
          <div className="skills-column">
            <h4>Навыки в резюме</h4>

            <div className="skills-list">
              {[...resume.skills, "NumPy", "Data Analysis", "Excel"].map(
                (skill) => (
                  <SkillPill key={skill} skill={skill} type="match" />
                )
              )}
            </div>
          </div>

          <div className="skills-column">
            <h4>Требуемые навыки</h4>

            <div className="skills-list">
            {vacancy.requiredSkills.map((skill) => {
              const isMatch = resumeSkills.has(skill);

              return (
                <SkillPill
                  key={skill}
                  skill={skill}
                  type={isMatch ? "match" : "missing"}
                />
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <section className="details-section">
        <h3>Опыт работы</h3>

        <div className="experience-info">
          <p>◈ Требуемый опыт: {vacancy.requiredExperience}</p>
          <p>◈ Опыт кандидата: {resume.experience}</p>
        </div>

        <div className="experience-progress">
          <div
            className="experience-progress__fill"
            style={{ width: `${vacancy.experience * 100}%` }}
          />
          <span>{formatScore(vacancy.experience)}</span>
        </div>
      </section>
    </aside>
  );
}

export default function ResumeMatcherTemplate() {
  const [selectedId, setSelectedId] = useState(1);

  const selectedVacancy =
    vacancies.find((vacancy) => vacancy.id === selectedId) || vacancies[0];

  return (
    <main className="resume-page">
      <div className="resume-page__layout">
        <section className="resume-page__main">
          <header className="resume-header">
            <h1>Resume Matcher</h1>
          </header>
          <SelectedResume />

          <h2 className="section-title">Топ подходящих вакансий</h2>

          <div className="vacancies-list">
            {vacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                active={vacancy.id === selectedId}
                onClick={() => setSelectedId(vacancy.id)}
              />
            ))}
          </div>
        </section>

        <VacancyDetails vacancy={selectedVacancy} />
      </div>
    </main>
  );
}