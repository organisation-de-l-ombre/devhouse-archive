import React, { FC, useCallback, useContext } from "react";
import styles from "./Layout.module.scss";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import banner from "../../assets/pictures/developershouse-banner.svg";
import { ThemeContext } from "../../contexts/Theme";

const Layout: FC = ({ children }) => {
  const changeLanguage = useCallback((): void => {
    alert("This feature is not impelemented yet. It will come soon.");
  }, []);
  const { switchTheme } = useContext(ThemeContext);

  return (
    <div className={styles.app}>
      <div className={styles["card-root"]}>
        <div className={styles.card}>
          <div className={styles.banner}>
            <img
              src={banner}
              alt="Developer's House banner"
              draggable={false}
            />
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <div className={styles.footer}>
          <div className={styles["footer-left"]}>
            <button type="button" onClick={changeLanguage}>
              Change language
            </button>
            <button type="button" onClick={switchTheme}>
              Change theme
            </button>
          </div>
          <div className={styles["footer-right"]}>
            <a href="/help">Help</a>
            <a href="https://developershouse.xyz/terms">Terms of service</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
