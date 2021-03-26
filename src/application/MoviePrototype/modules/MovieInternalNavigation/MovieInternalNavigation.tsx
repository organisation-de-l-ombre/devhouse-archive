import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { MovieObject } from "../../Types";
import TabBar from "../../../../components/modules/TabBar/TabBar";
import tabBarStyles from "../../../../components/modules/TabBar/TabBar.module.scss";
import useTabBar from "../../../../hooks/TabBar/TabBar";

const MovieInternalNavigation: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  const baseURL: string = useRouteMatch().path.replace(
    ":title",
    dataResponse.internalTitle.toLowerCase()
  );
  const { open, manageTabBar } = useTabBar();

  return (
    <TabBar open={open} manageTabBar={manageTabBar}>
      <NavLink
        to={baseURL}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        Film
      </NavLink>
      <NavLink
        to={`${baseURL}/casting`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        Casting
      </NavLink>
      <NavLink
        to={`${baseURL}/characters`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        Personnages
      </NavLink>
      <NavLink
        to={`${baseURL}/videos`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        Vidéos
      </NavLink>
      <NavLink
        to={`${baseURL}/ost`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        Bande originale
      </NavLink>
      <NavLink
        to={`${baseURL}/technical-specs`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        Fiche technique
      </NavLink>
    </TabBar>
  );
};

export default MovieInternalNavigation;
