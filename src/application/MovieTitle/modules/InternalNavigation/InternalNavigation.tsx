import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { useTabBar } from "@hooks/TabBar";
import { TabBar, tabBarStyles } from "@components/modules";
import { ReactMovieElement } from "@application/MovieTitle/types";
import { Trans, useTranslation } from "react-i18next";

const InternalNavigation: ReactMovieElement = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();
  const { open, manageTabBar } = useTabBar();
  const { t } = useTranslation("pages\\movieTitle\\tabbar");

  return (
    <TabBar id="movie-page-navigation" open={open} manageTabBar={manageTabBar}>
      {(Object.keys(dataResponse.body.data).slice(
        1
      ) as (keyof typeof dataResponse.body.data)[])
        .filter(
          (item: keyof typeof dataResponse.body.data): boolean =>
            dataResponse.body.data[item] !== undefined
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

export default InternalNavigation;
