import React from "react";
import { Sidebar, SidebarSection, SidebarItem } from "@components/modules";
import { Trans, useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";
import { FunctionComponent } from "@typings/FunctionComponent";

const InternalNavigation: FunctionComponent<
  HTMLDivElement,
  { open: boolean; manageSidebar: () => void }
> = ({ open, manageSidebar }) => {
  const { t } = useTranslation("pages\\wiki\\internal\\internal");
  const { url: baseURL } = useRouteMatch();

  return (
    <Sidebar
      open={open}
      manageSidebar={manageSidebar}
      picture="/icons/logo128.png"
      pictureAlt="IMR logo"
      title={t("sidebar.title")}
    >
      <SidebarSection>
        <h3>
          <Trans t={t} i18nKey="sidebar.sections.0.title" />
        </h3>
        <SidebarItem to={baseURL} exact>
          <Trans t={t} i18nKey="sidebar.sections.0.intro" />
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};

export default InternalNavigation;
