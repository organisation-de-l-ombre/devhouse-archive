import React from "react";
import { RiArrowUpSLine } from "react-icons/ri";
import { FunctionComponent } from "@typings/FunctionComponent";
import styles from "./BackToTop.module.scss";

const BackToTop: FunctionComponent<HTMLAnchorElement> = ({ href }) => {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
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
