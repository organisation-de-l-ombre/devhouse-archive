import React from "react";
import { Trans, useTranslation } from "react-i18next";
import Toggle from "react-toggle";
import { FaSun, FaMoon } from "react-icons/fa";
import { IoClose } from "react-icons/all";
import { GoCheck } from "react-icons/go";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import styles from "./Settings.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import Card from "../../../../components/ui/Card/Card";
import useTheme from "../../../../hooks/Theme/Theme";
import "../../../../themes/Toggle.scss";
import "./Toggle.scss";
import {
  useNotificationsManager,
  useNotificationsPreferences,
  useNotificationsState,
} from "../../../../hooks/Notifications/Notifications";
import generateNotificationID from "../../../../lib/generateNotificationID";
import { supportedLanguages } from "../../../../store/language/Types";
import SelectList, {
  manageSelection,
} from "../../../../components/ui/SelectList/SelectList";
import { DisplaySVG } from "../../../../components/modules/Navbar/LanguageModal";
import useLanguage from "../../../../hooks/Language/Language";
import Button from "../../../../components/ui/Button/Button";

const Settings = (): React.ReactElement => {
  const { t } = useTranslation("pages\\account\\sections\\settings");
  const { t: tModal } = useTranslation("components\\navbar");
  const { addNotifications } = useNotificationsManager();
  const { theme, switchTheme } = useTheme();
  const { allowNotifications } = useNotificationsState();
  const { updatePreference } = useNotificationsPreferences();
  const { setLanguageState, validateLanguage } = useLanguage();
  const changeTheme = (): void => {
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
  };
  const changeNotificationsPreferences = (): void => {
    updatePreference(!allowNotifications);

    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("websitePreferences.notifications.preferencesUpdated"),
        time: 5000,
      },
    ]);
  };

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${containerStyle.container} ${globalStyles["page-body-width"]}`}
    >
      <Card
        className={`${cardStyles.container} ${containerStyle.card} ${globalStyles.column} ${globalStyles["no-margin"]}`}
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
              checked={!!allowNotifications}
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
              className={` ${globalStyles.flex} ${globalStyles["flex-wrap"]}`}
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
                      <DisplaySVG lang={lang} alt={`lang-${lang}`} />
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
