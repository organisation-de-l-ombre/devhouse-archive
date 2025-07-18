import React, { FC } from "react";
import styles from "./footer.module.scss";

const Footer: FC = () => {
  return (
    <div className={styles.footer}>
      <p>
        Made with ❤ with <b>no css framework</b> by Kylian & Matthieu
      </p>
    </div>
  );
};

export default Footer;
