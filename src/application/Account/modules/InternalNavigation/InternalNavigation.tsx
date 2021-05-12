import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarItem,
  SidebarSection,
} from "@components/modules/Sidebar";
import { useUser } from "@hooks/User";
import { getAvatar } from "@lib/manageAuthentication";

const InternalNavigation: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    open: boolean;
    manageSidebar: () => void;
  }
> = ({ open, manageSidebar }) => {
  const baseURL: string = useRouteMatch().path;
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
