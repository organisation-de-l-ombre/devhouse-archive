import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Toggle from "react-toggle";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { GoCheck } from "react-icons/go";
import generateNotificationID from "@lib/generateNotificationID";
import { useLanguage } from "@hooks/Language";
import {
  useNotificationsManager,
  useNotificationsPreferences,
  useNotificationsState,
} from "@hooks/Notifications";
import { useTheme } from "@hooks/Theme";
import globalStyles from "@themes/Global.module.scss";
import { FlexContainer, Card, SelectList, Button } from "@components/ui";
import "@themes/Toggle.scss";
import { supportedLanguages } from "@store/language";
import { manageSelection } from "@components/ui/SelectList/SelectList";
import { DisplayLanguageSVG } from "@components/modules";
import containerStyle from "../../Containers.module.scss";
import styles from "./Settings.module.scss";

const Settings = (): React.ReactElement => {
  const { t } = useTranslation("pages\\account\\sections\\settings");
  const { t: tModal } = useTranslation("components\\navbar");
  const { addNotifications } = useNotificationsManager();
  const { theme, switchTheme } = useTheme();
  const { allowNotifications } = useNotificationsState();
  const { updatePreference } = useNotificationsPreferences();
  const { setLanguageState, validateLanguage } = useLanguage();
  const changeTheme = React.useCallback((): void => {
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
  const changeNotificationsPreferences = React.useCallback((): void => {
    updatePreference(!allowNotifications);

    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("websiteParameters.notifications.preferencesUpdated"),
        time: 5000,
      },
    ]);
  }, [addNotifications, allowNotifications, t, updatePreference]);

  return (
    <FlexContainer
      className={`${containerStyle.container} ${globalStyles["page-body-width"]}`}
    >
      <Card
        className={`${containerStyle.card} ${globalStyles.column} ${globalStyles["no-margin"]}`}
      >
        <h2>
          <Trans t={t} i18nKey="websiteParameters.title" />
        </h2>
        <div className={styles.items}>
          <div className={styles.item}>
            <h3>
              <Trans t={t} i18nKey="websiteParameters.theme.title" />
            </h3>
            <Toggle
              checked={theme === "light"}
              className="settings-toggle"
              icons={{
                checked: <FaSun />,
                unchecked: <FaMoon />,
              }}
              onChange={changeTheme}
            />
          </div>
          <div className={styles.item}>
            <h3>
              <Trans t={t} i18nKey="websiteParameters.notifications.title" />
            </h3>
            <Toggle
              checked={allowNotifications}
              className="settings-toggle"
              icons={{
                checked: <GoCheck />,
                unchecked: <IoClose />,
              }}
              onChange={changeNotificationsPreferences}
            />
          </div>
          <div className={styles.item}>
            <h3 className={globalStyles["no-margin"]}>
              <Trans t={t} i18nKey="websiteParameters.language.title" />
            </h3>
            <div
              className={`${globalStyles.flex} ${globalStyles["flex-wrap"]}`}
            >
              <SelectList
                className={styles.buttons}
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
                          i18nKey={`modal.select.languages.${lang}`}
                        />
                      </span>
                    </li>
                  );
                })}
              </SelectList>
              <Button
                className={styles.buttons}
                onClick={() => validateLanguage()}
              >
                <Trans
                  t={t}
                  i18nKey="websiteParameters.language.changeLanguage"
                />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </FlexContainer>
  );
};

export default Settings;
