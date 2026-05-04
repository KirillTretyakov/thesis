import React from "react";
import { Column, Row } from "../Flex";
import styles from "./style.module.scss";
import ScoreBar from "../components/ScoreBar/ScoreBar";

type VacancyScores = {
  semantics: number;
  skills: number;
  experience: number;
  total: number | null;
};

type Vacancy = {
  id: number;
  title: string;
  company: string;
  city: string;
  format: string;
  requiredExperience: string;
  scores: VacancyScores;
};

export const Card = ({
  format,
  company,
  id,
  scores,
  requiredExperience,
  city,
  title,
}: Vacancy) => {
  return (
    <Row className={styles.wrapper}>
      <Row className={styles.wrapContainer}>
        <Row className={styles.container_1}>
          <Column>
            <div className={styles.id}>{id}</div>
          </Column>
          <Column className={styles.mainBlock}>
            <div className={styles.title}>{title}</div>
            <Row>
              {company} - {city}, {format}
            </Row>
            <Row>
              <div>Требуемый опыт: {requiredExperience}</div>
            </Row>
          </Column>
        </Row>
        <Column className={styles.scoreWrapper}>
          <div className={styles.score}>
            {(
              (scores.semantics + scores.skills + scores.experience) /
              3
            ).toFixed(2)}
          </div>
        </Column>
      </Row>
      <div
        style={{
          height: "100px",
          width: "2px",
          backgroundColor: "#f3f2f2",
          margin: "auto 0",
        }}
      />
      <Column className={styles.statistics}>
        <ScoreBar value={scores.semantics} label="Семантика" />
        <ScoreBar value={scores.skills} label="Навыки" />
        <ScoreBar value={scores.experience} label="Опыт" />
      </Column>
    </Row>
  );
};
