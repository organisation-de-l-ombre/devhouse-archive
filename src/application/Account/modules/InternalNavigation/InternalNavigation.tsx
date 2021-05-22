import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
} from "@components/modules/Sidebar";
import useUser from "@hooks/useUser";
import { getAvatar } from "@lib/manageAuthentication";
import { FunctionComponent } from "@typings/FunctionComponent";

const InternalNavigation: FunctionComponent<
  HTMLDivElement,
  {
    open: boolean;
    manageSidebar: () => void;
  }
> = ({ open, manageSidebar }) => {
  const { path: baseURL } = useRouteMatch();
  const { user } = useUser();
  const { t } = useTranslation("pages\\account\\sidebar");

  return (
    <Sidebar
      title={user?.username as string}
      picture={getAvatar(user?.avatar as string)}
      pictureCircle
      pictureAlt={`Avatar of ${user?.username}`}
      open={open}
      manageSidebar={manageSidebar}
    >
      <SidebarSection>
        <SidebarItem to={baseURL}>
          <Trans t={t} i18nKey="items.account" />
        </SidebarItem>
        <SidebarItem to={`${baseURL}/authorizations`}>
          <Trans t={t} i18nKey="items.authorizations" />
        </SidebarItem>
        <SidebarItem to={`${baseURL}/settings`}>
          <Trans t={t} i18nKey="items.settings" />
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};

export default InternalNavigation;
