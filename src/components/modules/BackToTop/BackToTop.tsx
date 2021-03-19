import React from "react";
import { RiArrowUpSLine } from "react-icons/ri";
import styles from "./BackToTop.module.scss";

const BackToTop = (): React.ReactElement => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a className={styles.button} href="#">
      <RiArrowUpSLine />
    </a>
  );
};

export default BackToTop;
