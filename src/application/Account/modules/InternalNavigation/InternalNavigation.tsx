import React from "react";
import { useRouteMatch } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { Sidebar, SidebarItem, SidebarSection } from "@components/modules";
import useAccount from "@hooks/useAccount";
import { FunctionComponent } from "@typings/FunctionComponent";
import fetchImage from "@lib/fetchImage";

const InternalNavigation: FunctionComponent<
  HTMLDivElement,
  {
    open: boolean;
    manageSidebar: () => void;
  }
> = ({ open, manageSidebar }) => {
  const { path: baseURL } = useRouteMatch();
  const { user } = useAccount();
  const { t } = useTranslation("pages\\account\\sidebar");

  return (
    <Sidebar
      title={user?.username as string}
      picture={fetchImage({
        type: "image",
        image: user?.avatar as string,
        width: 128,
        height: 128,
      })}
      pictureCircle
      pictureAlt={`Avatar of ${user?.username}`}
      open={open}
      manageSidebar={manageSidebar}
    >
      <SidebarSection>
        <SidebarItem to={baseURL} exact>
          <Trans t={t} i18nKey="items.account" />
        </SidebarItem>
        <SidebarItem to={`${baseURL}/authorizations`} exact>
          <Trans t={t} i18nKey="items.authorizations" />
        </SidebarItem>
        <SidebarItem to={`${baseURL}/settings`} exact>
          <Trans t={t} i18nKey="items.settings" />
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};

export default InternalNavigation;
