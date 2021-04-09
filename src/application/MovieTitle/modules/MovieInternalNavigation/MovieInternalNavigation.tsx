import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useTabBar } from "@hooks/TabBar";
import TabBar from "../../../../components/modules/TabBar/TabBar";
import tabBarStyles from "../../../../components/modules/TabBar/TabBar.module.scss";
import { S3DataResponse } from "../../types";

const MovieInternalNavigation: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: S3DataResponse }
> = ({ dataResponse }) => {
  const baseURL: string = useRouteMatch().path.replace(
    ":title",
    dataResponse.id
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
