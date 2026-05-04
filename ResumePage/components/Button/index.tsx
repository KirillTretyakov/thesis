import React, {ButtonHTMLAttributes} from "react";
import styles from "./styles.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: React.ReactNode;
};

export const Button = ({ icon, children, ...rest }: ButtonProps) => {
  return (
      <button className={styles.btn} {...rest}>
        {icon}
        {children}
      </button>
  );
};
