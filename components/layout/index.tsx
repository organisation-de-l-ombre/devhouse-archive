import React, { FC, useContext } from "react";
import styles from "./Layout.module.scss";
import { ThemeContext } from "../../contexts/Theme";
import { DevHouseLogo } from "./logo";

const Layout: FC = ({ children }) => {
  const { switchTheme } = useContext(ThemeContext);

  return (
    <div className={styles.app}>
      <div className={styles["card-root"]}>
        <div className={styles.card}>
          <div className={styles.banner}>
            <DevHouseLogo />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <div className={styles.footer}>
          <div className={styles["footer-left"]}>
            <button
              type="button"
              onClick={switchTheme}
              title="Change colors theme"
              aria-label="Change colors theme"
            >
              Change theme
            </button>
          </div>
          <div className={styles["footer-right"]}>
            <a
              href="https://developershouse.xyz/projects/login"
              title="Get help"
              aria-label="Get help"
            >
              Help
            </a>
            <a
              href="https://developershouse.xyz/terms"
              title="Terms of service"
              aria-label="Terms of service"
            >
              Terms of service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
