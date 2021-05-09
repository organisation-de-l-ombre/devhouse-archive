import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useTabBar } from "@hooks/TabBar";
import { TabBar, tabBarStyles } from "@components/modules";
import { ReactMovieElement } from "@application/MovieTitle/types";
import { Trans, useTranslation } from "react-i18next";

const MovieInternalNavigation: ReactMovieElement = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();
  const { open, manageTabBar } = useTabBar();
  const { t } = useTranslation("pages\\moviePrototype\\tabbar");

  return (
    <TabBar id="movie-page-navigation" open={open} manageTabBar={manageTabBar}>
      {(Object.keys(dataResponse.data).slice(
        1
      ) as (keyof typeof dataResponse.data)[])
        .filter(
          (item: keyof typeof dataResponse.data): boolean =>
            dataResponse.data[item] !== undefined
        )
        .map(
          (item: string): React.ReactElement => {
            return (
              <NavLink
                key={item}
                to={`${baseURL}${item !== "movie" ? `/${item}` : ""}`}
                exact
                activeClassName={tabBarStyles.active}
                onClick={manageTabBar}
              >
                <Trans t={t} i18nKey={item} />
              </NavLink>
            );
          }
        )}
    </TabBar>
  );
};

export default MovieInternalNavigation;
