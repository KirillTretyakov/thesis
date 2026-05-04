import React, { useEffect, useState } from "react";
import "./scoreBar.css"

interface ScoreBarProps {
  /** Значение от 0 до 1 */
  value: number;
  /** Подпись слева (Semantics, Skills, Experience…) */
  label?: string;
  /** Показывать ли числовое значение справа */
  showValue?: boolean;
  /** Высота полосы (px) */
  height?: number;
  maxWidth?: string
}

const getColorClass = (percent: number): string => {
  if (percent >= 70) return "score-bar__fill--high";
  if (percent >= 40) return "score-bar__fill--medium";
  return "score-bar__fill--low";
};

const ScoreBar: React.FC<ScoreBarProps> = ({
  value,
  label,
  showValue = true,
  height = 8,
  maxWidth = "150px"
}) => {
  // ограничим значение от 0 до 1
  const clamped = Math.max(0, Math.min(value, 1));
  const percent = Math.round(clamped * 100);

  // небольшая задержка для анимации при появлении
  const [renderedPercent, setRenderedPercent] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setRenderedPercent(percent), 50);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div
      className="score-bar"
      aria-label={label ? `${label}: ${percent}%` : `Score: ${percent}%`}
    >
      {label && <span className="score-bar__label">{label}</span>}
      <div className="score-bar__track" style={{ maxWidth: maxWidth }}>
        <div
          className={`score-bar__fill ${getColorClass(percent)}`}
          style={{
            width: `${renderedPercent}%`,
            height: `${height}px`,
          }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showValue && <span className="score-bar__value">{percent}%</span>}
    </div>
  );
};

export default ScoreBar;
