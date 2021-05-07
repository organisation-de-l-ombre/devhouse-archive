import React from "react";
import { AiOutlineLoading } from "react-icons/all";
import styles from "./loader.module.scss";

export const SmallLoader: React.FC = () => {
  return <AiOutlineLoading className={styles.loader} />;
};
