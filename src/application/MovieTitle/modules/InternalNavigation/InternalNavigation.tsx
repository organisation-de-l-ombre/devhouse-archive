import React from "react";
import { useRouteMatch } from "react-router-dom";
import useTabBar from "@hooks/useTabBar";
import { TabBar, TabBarItem } from "@components/modules";
import { MovieTitleComponent } from "@typings/movieTitle";
import { Trans, useTranslation } from "react-i18next";

const InternalNavigation: MovieTitleComponent = ({
  dataResponse: { data },
}) => {
  const { url: baseURL } = useRouteMatch();
  const { open, manageTabBar } = useTabBar();
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");

  return (
    <TabBar open={open} manageTabBar={manageTabBar}>
      {(Object.keys(data).slice(1) as (keyof typeof data)[])
        .filter((item: keyof typeof data): boolean => data[item] !== undefined)
        .map((item: string): React.ReactElement => {
          return (
            <TabBarItem
              key={item}
              to={`${baseURL}${item !== "movie" ? `/${item}` : ""}`}
              exact
              onClick={manageTabBar}
              aria-label={t(`tabBar.${item}.acronym`)}
              title={t(`tabBar.${item}.acronym`)}
            >
              <Trans t={t} i18nKey={`tabBar.${item}.name`} />
            </TabBarItem>
          );
        })}
    </TabBar>
  );
};

export default InternalNavigation;
