import classNames from "classnames";
import React from "react";
import { Column, Row } from "../Flex";
import ScoreBar from "../components/ScoreBar/ScoreBar";
import styles from "./styles.module.scss";

const cn = classNames.bind(styles);

interface SkillMatch {
  match: string[];
  partial: string[];
  missing: string[];
}

interface VacancyDetails {
  title: string;
  totalScore: number;
  company: string;
  city: string;
  format: string;
  requiredExperience: string;
  candidateExperience: number;
  skillMatch: SkillMatch;
  allResumeSkills: string[];
}

const VacancyDetails = ({
  allResumeSkills,
  skillMatch,
  candidateExperience,
  requiredExperience,
  city,
  company,
  format,
  title,
  totalScore,
}: VacancyDetails) => {
  return (
    <Column style={{ gap: "32px" }}>
      <Column style={{ gap: "16px" }}>
        <Row style={{ justifyContent: "space-between", alignItems: "end" }}>
          <div className={styles.title}>{title}</div>
          <div className={styles.score}>{totalScore}</div>
        </Row>
        <Row style={{ justifyContent: "space-between" }}>
          <div>
            {company} - {city}, {format}
          </div>
          <div>Итоговый счёт</div>
        </Row>
      </Column>

      <Row style={{ gap: "16px" }}>
        <Column className={styles.cardWrapper}>
          <div className={styles.cardTitle}>Семантика</div>
          <div className={styles.cardScore}>0.76</div>
        </Column>
        <Column className={styles.cardWrapper}>
          <div className={styles.cardTitle}>Навыки</div>
          <div className={styles.cardScore}>0.85</div>
        </Column>
        <Column className={styles.cardWrapper}>
          <div className={styles.cardTitle}>Опыт</div>
          <div className={styles.cardScore}>0.90</div>
        </Column>
      </Row>

      <Column style={{ gap: "16px" }}>
        <h2>Навыки</h2>
        <Row style={{ gap: "16px" }}>
          <Row style={{ alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            />
            <div>Совпадает</div>
          </Row>
          <Row style={{ alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "yellow",
              }}
            />

            <div>Частично</div>
          </Row>
          <Row style={{ alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "red",
              }}
            />

            <div>Отсутствует</div>
          </Row>
        </Row>
        <Row style={{ justifyContent: 'space-between', gap: "8px" }}>
          <Column className={styles.cardSkills}>
            <h3 style={{ margin: "0 0 24px"  }}>Навыки в резюме</h3>
            {allResumeSkills.map((v, i) => (
              <div key={i} className={cn(styles.cardValue, styles.match)}>
                {v}
              </div>
            ))}
          </Column>
          <Column className={styles.cardSkills}>
            <h3 style={{ margin: "0 0 24px" }}>Требуемые навыки</h3>
            {skillMatch.match.map((v, i) => (
              <div key={i} className={cn(styles.cardValue, styles.match)}>
                {v}
              </div>
            ))}
            {skillMatch.partial.map((v, i) => (
              <div key={i} className={cn(styles.cardValue, styles.partial)}>
                {v}
              </div>
            ))}
            {skillMatch.missing.map((v, i) => (
              <div key={i} className={cn(styles.cardValue, styles.missing)}>
                {v}
              </div>
            ))}
          </Column>
        </Row>
        <Column style={{ gap: "16px", width: '100%' }}>
          <h3 style={{ margin: 0 }}>Опыт работы</h3>
          <div>Требуемый опыт: {requiredExperience}</div>
          <div>Опыт кандидата: {candidateExperience}</div>
          <ScoreBar value={0.9} maxWidth="100%" />
        </Column>
      </Column>
    </Column>
  );
};

export default VacancyDetails;
