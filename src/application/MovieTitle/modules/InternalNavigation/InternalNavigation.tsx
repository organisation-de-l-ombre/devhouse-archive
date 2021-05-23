import React from "react";
import { useRouteMatch } from "react-router-dom";
import useTabBar from "@hooks/useTabBar";
import { TabBar, TabBarItem } from "@components/modules";
import { ReactMovieElement } from "@application/MovieTitle/types";
import { Trans, useTranslation } from "react-i18next";

const InternalNavigation: ReactMovieElement = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();
  const { open, manageTabBar } = useTabBar();
  const { t } = useTranslation("pages\\movieTitle\\tabbar");

  return (
    <TabBar open={open} manageTabBar={manageTabBar}>
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
              <TabBarItem
                key={item}
                to={`${baseURL}${item !== "movie" ? `/${item}` : ""}`}
                exact
                onClick={manageTabBar}
              >
                <Trans t={t} i18nKey={item} />
              </TabBarItem>
            );
          }
        )}
    </TabBar>
  );
};

export default InternalNavigation;
