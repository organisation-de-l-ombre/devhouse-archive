import React from "react";
import { RiArrowUpSLine } from "react-icons/ri";
import { FunctionComponent } from "@typings/FunctionComponent";
import styles from "./BackToTop.module.scss";

const BackToTop: FunctionComponent<HTMLAnchorElement> = ({ href }) => {
  return (
    <a
      className={styles.button}
      href={href || "#"}
      aria-label="Back to the top of the page"
    >
      <RiArrowUpSLine />
    </a>
  );
};

export default BackToTop;
