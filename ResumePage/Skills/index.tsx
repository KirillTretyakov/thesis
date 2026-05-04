import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Column } from "../Flex";
import styles from "./styles.module.scss"

export const Skills = () => {
  const [value, setValue] = useState("");

  return (
    <Column style={{ gap: '24px' }}>
      <Input
        value={value}
        placeholder="Например python"
        label="Навыки"
        onChange={(e) => setValue(e.target.value)}
      />
      <Button style={{ border: '1px solid #8b00ff', borderRadius: "8px", color: ' #8b00ff' }}>Применить</Button>
    </Column>
  );
};
