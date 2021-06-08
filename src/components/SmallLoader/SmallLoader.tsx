import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import styles from "./loader.module.scss";

export const SmallLoader: React.FC = () => {
  return <AiOutlineLoading className={styles.loader} />;
};
