import React from "react";
import { Column } from "../Flex";
import styles from "./styles.module.scss"
import classNames from "classnames";

const cn = classNames.bind(styles)

type MetricsType = {
  goodMatchRateAt5: number;
  experienceFitRateAt5: number;
  meanSemanticScoreAt5: number;
};

export const Metrics = ({
  goodMatchRateAt5,
  experienceFitRateAt5,
  meanSemanticScoreAt5,
}: MetricsType) => {
  return (
    <Column className={styles.metrics}>
      <h3 style={{ margin: '0' }}>Метрики (Топ-5)</h3>
      <Column style={{ gap: "8px" }}>
        <div>Good match Rate@5</div>
        <div className={cn(styles.score, styles.purple)}>{goodMatchRateAt5}</div>
      </Column>

      <Column style={{ gap: "8px" }}>
        <div>Experience Fit Rate@5</div>
        <div className={cn(styles.score, styles.green)}>{experienceFitRateAt5}</div>
      </Column>

      <Column style={{ gap: "8px" }}>
        <div>Mean Semantic Score@5</div>
        <div className={cn(styles.score, styles.blue)}>{meanSemanticScoreAt5}</div>
      </Column>
    </Column>
  );
};
