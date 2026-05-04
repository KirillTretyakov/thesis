import React, { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss";
import { Column } from "../../Flex";

const cn = classNames.bind(styles);

type InputType = InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  wrapperClassName?: any;
  label?: string;
};

export const Input = ({ icon, wrapperClassName, label, ...p }: InputType) => {
  return (
    <Column style={{ gap: "8px" }}>
      {label && <div>{label}</div>}
      <div className={cn(styles.inputWrapper, wrapperClassName)}>
        <input className={styles.input} type="text" {...p} />
      </div>
    </Column>
  );
};
