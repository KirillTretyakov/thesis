import React from "react";
import styles from "./rangeInput.module.scss";

interface RangeSliderProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min = 0,
  max = 10,
  value,
  onChange,
  label,
}) => {
  // Процент заполнения (0–100)
  const fillPercent = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={styles.rangeSlider}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.marks}>
        <span className={styles.mark}>{min}</span>
        <span className={styles.mark}>{max}</span>
      </div>
      <input
        type="range"
        className={styles.input}
        style={
          {
            // Передаём процент в CSS-переменную
            "--fill-percent": `${fillPercent}%`,
          } as React.CSSProperties
        }
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />

    </div>
  );
};
