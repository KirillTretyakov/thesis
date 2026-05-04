import React from "react";
import { Column, Row } from "../Flex";
import styles from "./styles.module.scss";

type SelectedResume = {
  title: string;
  experienceYears: number;
  location: string;
  skills: string[];
};

const SelectedResume = ({
  experienceYears,
  skills,
  title,
  location,
}: SelectedResume) => {
  return (
    <Column className={styles.wrapper}>
      <Row className={styles.header}>
        <div
          style={{ minWidth: "350px", fontSize: "20px", lineHeight: "26px", color: '#8B00FF' }}
        >
          {title}
        </div>
        <div style={{ color: "grey" }}>Навыки:</div>
      </Row>
      <Row>
        <div style={{ minWidth: "350px" }}>Опыт работы: {experienceYears}</div>
        <Row className={styles.skills}>
          {skills.map((s, i) => (
            <div key={i} className={styles.skill}>{s}</div>
          ))}
        </Row>
      </Row>
      <Row>
        <div style={{ minWidth: "350px" }}>Локация: {location}</div>
      </Row>
    </Column>
  );
};

export default SelectedResume;
