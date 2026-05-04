import React from "react";
import { Column } from "../Flex";
import { Card } from "./Card";
import style from "./style.module.scss"

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

type VacancyArray = {
  topVacancies: Vacancy[];
};

const TopVacancies = ({ topVacancies }: VacancyArray) => {
  return (
    <Column className={style.topVacanciesWrapper}>
      {topVacancies.map((v, i) => (
        <Card
          id={v.id}
          title={v.title}
          company={v.company}
          city={v.city}
          format={v.format}
          requiredExperience={v.requiredExperience}
          scores={v.scores}
          key={i}
        />
      ))}
    </Column>
  );
};

export default TopVacancies;
