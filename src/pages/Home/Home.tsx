import React, { useContext } from "react";
import styles from "./Home.module.scss";
import ThemeContext from "../../themes/ThemeContext";
import Button from "../../components/Button/Button";

export default function Home(): React.ReactElement {
  const { changeTheme } = useContext(ThemeContext);

  return (
    <div className={styles.home}>
      <Button onClick={changeTheme}>Change theme</Button>
    </div>
  );
}
