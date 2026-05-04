import React from "react";
import { Column } from "../Flex";
import { Button } from "../components/Button";
import { Metrics } from "../Metrics";
import styles from "./styles.module.scss";
import { Skills } from "../Skills";
import { Filters } from "../Filters";

type FiltersBlockType = {
  goodMatchRateAt5: number;
  experienceFitRateAt5: number;
  meanSemanticScoreAt5: number;
};

export const FiltersBlock = ({
  goodMatchRateAt5,
  experienceFitRateAt5,
  meanSemanticScoreAt5,
}: FiltersBlockType) => {
  const handler = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    console.log("нажали", target.textContent);
  };

  return (
    <>
      <h2
        className={styles.title}
        style={{ margin: "0", color: "#8b00ff" }}
      >
        Resume matcher
      </h2>

      <Column className={styles.filterBlock}>
        <Column>
          <Button
            style={{ display: "flex", justifyContent: "start" }}
            onClick={handler}
          >
            Подбор вакансий
          </Button>
          <Button
            style={{ display: "flex", justifyContent: "start" }}
            onClick={handler}
          >
            Вывод вакансии
          </Button>
          <Button
            style={{ display: "flex", justifyContent: "start" }}
            onClick={handler}
          >
            Аналитика
          </Button>
        </Column>

        <Filters />

        <Skills />

        <Metrics
          goodMatchRateAt5={goodMatchRateAt5}
          experienceFitRateAt5={experienceFitRateAt5}
          meanSemanticScoreAt5={meanSemanticScoreAt5}
        />
      </Column>
    </>
  );
};
