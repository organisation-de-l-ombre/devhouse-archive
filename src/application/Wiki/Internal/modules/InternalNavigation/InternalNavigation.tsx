import React from "react";
import {
  Sidebar,
  SidebarSection,
  SidebarItem,
} from "@components/modules/Sidebar";
import IMRLogoMinimal from "@assets/pictures/imr/imr-minimal.png";
import { Trans, useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

const InternalNavigation: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { open: boolean; manageSidebar: () => void }
> = ({ open, manageSidebar }) => {
  const { t } = useTranslation("pages\\wiki\\internal\\sidebar");
  const { url: baseURL } = useRouteMatch();

  return (
    <Sidebar
      open={open}
      manageSidebar={manageSidebar}
      picture={IMRLogoMinimal}
      pictureAlt="IMR logo"
      title={t("title")}
    >
      <SidebarSection>
        <h3>
          <Trans t={t} i18nKey="sections.0.title" />
        </h3>
        <SidebarItem to={baseURL}>
          <Trans t={t} i18nKey="sections.0.intro" />
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  );
};

export default InternalNavigation;
