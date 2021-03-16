import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { MovieObject } from "../../Types";
import TabBar from "../../../../components/modules/TabBar/TabBar";
import tabBarStyles from "../../../../components/modules/TabBar/TabBar.module.scss";

const MovieInternalNavigation: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  const baseURL: string = useRouteMatch().path.replace(
    ":title",
    dataResponse.internalTitle
  );

  return (
    <TabBar>
      <NavLink to={baseURL} exact activeClassName={tabBarStyles.active}>
        Film
      </NavLink>
      <NavLink
        to={`${baseURL}/casting`}
        exact
        activeClassName={tabBarStyles.active}
      >
        Casting
      </NavLink>
      <NavLink
        to={`${baseURL}/characters`}
        exact
        activeClassName={tabBarStyles.active}
      >
        Personnages
      </NavLink>
      <NavLink
        to={`${baseURL}/videos`}
        exact
        activeClassName={tabBarStyles.active}
      >
        Vidéos
      </NavLink>
      <NavLink
        to={`${baseURL}/ost`}
        exact
        activeClassName={tabBarStyles.active}
      >
        Bande originale
      </NavLink>
      <NavLink
        to={`${baseURL}/technical-specs`}
        exact
        activeClassName={tabBarStyles.active}
      >
        Fiche technique
      </NavLink>
    </TabBar>
  );
};

export default MovieInternalNavigation;
