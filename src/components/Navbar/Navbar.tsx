import { FaMoon, FaSun, MdLocalMovies } from "react-icons/all";
import { NavLink } from "react-router-dom";
import React from "react";
import styles from "./Navbar.module.scss";
import { Button } from "../Button/Button";
import { ThemeContext } from "../../themes/ThemeContext";

export const Navbar = (): React.ReactElement => {
  const [open, setOpen] = React.useState(false);
  const { changeTheme, theme } = React.useContext(ThemeContext);

  return (
    <nav className={`${styles.navbar}${open ? ` ${styles.open}` : ""}`}>
      <Button className={styles["mobile-menu"]} onClick={() => setOpen(!open)}>
        <MdLocalMovies />
        <h1>International Media Referencing</h1>
      </Button>

      <div className={styles.start}>
        <NavLink to="/" exact activeClassName={styles.active}>
          Home
        </NavLink>
        <NavLink to="/movies" activeClassName={styles.active}>
          Movies
        </NavLink>
        <NavLink to="/series" activeClassName={styles.active}>
          Series
        </NavLink>
      </div>
      <div className={styles.end}>
        <Button className={styles.theme} onClick={changeTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
          <span>Switch to {theme === "light" ? "dark" : "light"} theme</span>
        </Button>
      </div>
    </nav>
  );
};
