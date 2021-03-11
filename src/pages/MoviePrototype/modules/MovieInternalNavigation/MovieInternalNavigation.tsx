import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { AiOutlineLink } from "react-icons/ai";
import styles from "./MovieInternalNavigation.module.scss";
import Button from "../../../../components/Button/Button";

const MovieInternalNavigation: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { scroll: boolean }
> = ({ scroll }) => {
  const baseURL: string = useRouteMatch().path;
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <div
      className={`${styles["navigation-container"]}${
        scroll ? ` ${styles.fixed}` : ""
      }`}
    >
      <Button onClick={() => setOpen(!open)}>
        <AiOutlineLink />
        <span>Accéder à la navigation</span>
      </Button>
      <div
        className={`${styles["navigation-items"]}${
          open ? ` ${styles.open}` : ""
        }`}
      >
        <NavLink to={baseURL} exact activeClassName={styles.active}>
          Film
        </NavLink>
        <NavLink
          to={`${baseURL}/casting`}
          exact
          activeClassName={styles.active}
        >
          Casting
        </NavLink>
        <NavLink
          to={`${baseURL}/characters`}
          exact
          activeClassName={styles.active}
        >
          Personnages
        </NavLink>
        <NavLink to={`${baseURL}/videos`} exact activeClassName={styles.active}>
          Vidéos
        </NavLink>
        <NavLink to={`${baseURL}/songs`} exact activeClassName={styles.active}>
          Chansons
        </NavLink>
        <NavLink
          to={`${baseURL}/technical-specs`}
          exact
          activeClassName={styles.active}
        >
          Fiche technique
        </NavLink>
      </div>
    </div>
  );
};

export default MovieInternalNavigation;
