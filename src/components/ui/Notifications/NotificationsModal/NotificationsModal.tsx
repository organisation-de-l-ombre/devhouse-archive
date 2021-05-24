/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { FcCheckmark } from "react-icons/fc";
import generateNotificationID from "@lib/generateNotificationID";
import {
  useNotificationsManager,
  useNotificationsPreferences,
  useNotificationsState,
} from "@hooks/useNotifications";
import { css } from "@emotion/react";
import globalStyles from "@styles/Global.module.scss";
import { Modal, SelectList, Button } from "@components/ui";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import { manageSelection } from "../../SelectList/SelectList";

const NotificationsModal: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ open, setOpen }) => {
  const { t } = useTranslation("components\\notifications\\notificationsModal");
  const { allowNotifications } = useNotificationsState();
  const {
    setNotificationsPreferencesState,
    validateChoice,
  } = useNotificationsPreferences();
  const { addNotifications } = useNotificationsManager();

  return (
    <Modal
      windowTitle={<Trans t={t} i18nKey="title" />}
      open={open}
      setOpen={setOpen}
    >
      <p
        className={`${globalStyles["primary-margin"]} ${globalStyles["text-align-center"]}`}
      >
        <Trans t={t} i18nKey="description" />
      </p>
      <FlexContainer allowWrap fullCentered>
        <SelectList
          css={css`
            li {
              justify-content: space-between;

              svg {
                transform: scale(1.5);
              }
            }
          `}
          defaultTitle={<Trans t={t} i18nKey="options.default" />}
          id="select-notifications-choice"
        >
          <li
            onClick={() => {
              setNotificationsPreferencesState(true);
              manageSelection("select-notifications-choice", "none");
            }}
          >
            <span>
              <Trans t={t} i18nKey="options.yes" />
            </span>
            {allowNotifications ? <FcCheckmark /> : <></>}
          </li>
          <li
            onClick={() => {
              setNotificationsPreferencesState(false);
              manageSelection("select-notifications-choice", "none");
            }}
          >
            <span>
              <Trans t={t} i18nKey="options.no" />
            </span>
            {allowNotifications ? <></> : <FcCheckmark />}
          </li>
        </SelectList>
        <Button
          css={{ backgroundColor: "var(--secondary-background-color)" }}
          onClick={() => {
            const validation: boolean = validateChoice(setOpen);

            if (validation) {
              addNotifications([
                {
                  id: generateNotificationID(),
                  type: "info",
                  time: 5000,
                  body: t(
                    "components\\notifications\\notificationsModal:preferencesUpdated"
                  ),
                },
              ]);
            }
          }}
        >
          <Trans t={t} i18nKey="savePreference" />
        </Button>
      </FlexContainer>
    </Modal>
  );
};

export default NotificationsModal;
