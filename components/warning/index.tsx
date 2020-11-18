import { FC } from "react";
import styles from "./Warning.module.scss";

export const Warning: FC = ({ children }) => {
  return <div className={styles.warning}>{children}</div>;
};
