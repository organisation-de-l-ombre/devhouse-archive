import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import useTabBar from "../../../../hooks/TabBar/TabBar";
import TabBar from "../../../../components/modules/TabBar/TabBar";
import tabBarStyles from "../../../../components/modules/TabBar/TabBar.module.scss";

const AccountInternalNavigation = (): React.ReactElement => {
  const baseURL: string = useRouteMatch().path;
  const { open, manageTabBar } = useTabBar();
  const { t } = useTranslation("pages\\account\\tabBar");

  return (
    <TabBar open={open} manageTabBar={manageTabBar}>
      <NavLink
        to={baseURL}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        <Trans t={t} i18nKey="account" />
      </NavLink>
      <NavLink
        to={`${baseURL}/authorizations`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        <Trans t={t} i18nKey="authorizations" />
      </NavLink>
      <NavLink
        to={`${baseURL}/settings`}
        exact
        activeClassName={tabBarStyles.active}
        onClick={manageTabBar}
      >
        <Trans t={t} i18nKey="settings" />
      </NavLink>
    </TabBar>
  );
};

export default AccountInternalNavigation;
