/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import Toggle from "react-toggle";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GoCheck } from "react-icons/go";
import generateNotificationID from "@lib/generateNotificationID";
import useLanguage from "@hooks/useLanguage";
import {
  useNotificationsManager,
  useNotificationsPreferences,
  useNotificationsState,
} from "@hooks/useNotifications";
import useTheme from "@hooks/useTheme";
import globalStyles from "@themes/Global.module.scss";
import {
  FlexContainer,
  SelectList,
  Button,
  CardContainer,
  Card,
} from "@components/ui";
import "@themes/Toggle.scss";
import { supportedLanguages } from "@store/language";
import { manageSelection } from "@components/ui/SelectList/SelectList";
import { DisplayLanguageSVG } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import containerStyle from "../../Containers.module.scss";
import "./Toggle.scss";

const Settings: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\account\\sections\\settings");
  const { t: tModal } = useTranslation(
    "components\\ui\\languageModal\\languageModal"
  );
  const { addNotifications } = useNotificationsManager();
  const { theme, switchTheme } = useTheme();
  const { allowNotifications } = useNotificationsState();
  const { updatePreference } = useNotificationsPreferences();
  const { setLanguageState, validateLanguage } = useLanguage();
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

  return (
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
          <FlexContainer allowWrap className={containerStyle["control-items"]}>
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
              <label htmlFor="notifications-toggle">
                <Trans t={t} i18nKey="websiteParameters.notifications.title" />
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
            <FlexContainer column>
              <h3 className={globalStyles["no-margin"]}>
                <Trans t={t} i18nKey="websiteParameters.language.title" />
              </h3>
              <FlexContainer allowWrap>
                <SelectList
                  className={containerStyle["language-button"]}
                  defaultTitle={
                    <Trans
                      t={t}
                      i18nKey="websiteParameters.language.defaultSelect"
                    />
                  }
                  id="select-language-website-settings"
                >
                  {supportedLanguages.sort().map((lang) => {
                    return (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                      <li
                        key={lang}
                        onClick={() => {
                          setLanguageState(lang);
                          manageSelection(
                            "select-language-website-settings",
                            "none"
                          );
                        }}
                      >
                        <DisplayLanguageSVG lang={lang} alt={`lang-${lang}`} />
                        <span>
                          <Trans
                            t={tModal}
                            i18nKey={`select.languages.${lang}`}
                          />
                        </span>
                      </li>
                    );
                  })}
                </SelectList>
                <Button
                  className={containerStyle["language-button"]}
                  onClick={() => validateLanguage()}
                >
                  <Trans
                    t={t}
                    i18nKey="websiteParameters.language.changeLanguage"
                  />
                </Button>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </Card>
      </CardContainer>
    </FlexContainer>
  );
};

export default Settings;
