import React from "react";
import { Column } from "../Flex";
import { RangeSlider } from "../components/Input/RangeInput";

export const Filters = () => {
  const [experience, setExperience] = React.useState(0);

  return (
    <Column style={{ gap: '24px' }}>
      <h3 style={{ margin: "0" }}>Фильтры</h3>

      <RangeSlider
        value={experience}
        onChange={setExperience}
        label="Опыт работы (годы)"
        min={0}
        max={10}
      />

    </Column>
  );
};
