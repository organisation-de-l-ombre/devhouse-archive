/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import Toggle from "react-toggle";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GoCheck } from "react-icons/go";
import generateNotificationID from "@lib/generateNotificationID";
import {
  useNotificationsManager,
  useNotificationsPreferences,
  useNotificationsState,
} from "@hooks/useNotifications";
import useTheme from "@hooks/useTheme";
import globalStyles from "@styles/Global.module.scss";
import {
  FlexContainer,
  Button,
  CardContainer,
  Card,
  LanguageModal,
} from "@components/ui";
import "../../../../styles/Toggle.scss";
import { FunctionComponent } from "@typings/FunctionComponent";
import themes from "@styles/Themes.module.scss";
import containerStyle from "../../Containers.module.scss";
import "./Toggle.scss";

const Settings: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\account\\sections\\settings");
  const { addNotifications } = useNotificationsManager();
  const { theme, contrastMode, switchTheme, toggleContrastMode } = useTheme();
  const { allowNotifications } = useNotificationsState();
  const { updatePreference } = useNotificationsPreferences();
  const changeTheme = useCallback((): void => {
    switchTheme();

    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t(
          `websiteParameters.theme.themeChanged.${
            theme === "light" ? "dark" : "light"
          }`
        ),
        time: 5000,
      },
    ]);
  }, [addNotifications, switchTheme, t, theme]);
  const changeThemeContrast = useCallback((): void => {
    if (!themes[`${theme}-contrast`]) {
      alert(t("websiteParameters.contrastMode.error"));

      return;
    }

    toggleContrastMode();
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t(
          `websiteParameters.contrastMode.${
            !contrastMode ? "enabled" : "disabled"
          }`
        ),
        time: 5000,
      },
    ]);
  }, [addNotifications, contrastMode, t, theme, toggleContrastMode]);
  const changeNotificationsPreferences = useCallback((): void => {
    updatePreference();

    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("websiteParameters.notifications.preferencesUpdated"),
        time: 5000,
      },
    ]);
  }, [addNotifications, t, updatePreference]);
  const [languageModalOpen, setlanguageModalOpen] = useState<boolean>(false);

  return (
    <>
      <LanguageModal
        languageWindowOpen={languageModalOpen}
        setLanguageWindowOpen={setlanguageModalOpen}
      />
      <FlexContainer
        padding
        expand
        pageBodyWidth
        column
        className={containerStyle.container}
      >
        <CardContainer noMargin direction="column">
          <Card noPadding transparent className={containerStyle.card}>
            <h2>
              <Trans t={t} i18nKey="websiteParameters.title" />
            </h2>
            <FlexContainer
              allowWrap
              className={containerStyle["control-items"]}
            >
              <form>
                <label htmlFor="theme-toggle">
                  <Trans t={t} i18nKey="websiteParameters.theme.title" />
                </label>
                <Toggle
                  id="theme-toggle"
                  checked={theme === "light"}
                  className="settings-toggle"
                  icons={{
                    checked: <FaSun />,
                    unchecked: <FaMoon />,
                  }}
                  onChange={changeTheme}
                />
              </form>
              <form>
                <label htmlFor="theme-contrast-toggle">
                  <Trans t={t} i18nKey="websiteParameters.contrastMode.title" />
                </label>
                <Toggle
                  id="theme-contrast-toggle"
                  checked={contrastMode}
                  className="settings-toggle"
                  icons={{
                    checked: <GoCheck />,
                    unchecked: <IoClose />,
                  }}
                  onChange={changeThemeContrast}
                />
              </form>
              <form>
                <label htmlFor="notifications-toggle">
                  <Trans
                    t={t}
                    i18nKey="websiteParameters.notifications.title"
                  />
                </label>
                <Toggle
                  id="notifications-toggle"
                  checked={allowNotifications}
                  className="settings-toggle"
                  icons={{
                    checked: <GoCheck />,
                    unchecked: <IoClose />,
                  }}
                  onChange={changeNotificationsPreferences}
                />
              </form>
              <form>
                <h3 className={globalStyles["no-margin"]}>
                  <Trans t={t} i18nKey="websiteParameters.language.title" />
                </h3>
                <Button
                  css={{ width: "fit-content", marginTop: "1rem" }}
                  onClick={() => setlanguageModalOpen(true)}
                >
                  <Trans t={t} i18nKey="websiteParameters.language.button" />
                </Button>
              </form>
            </FlexContainer>
          </Card>
        </CardContainer>
      </FlexContainer>
    </>
  );
};

export default Settings;
