import React from "react";
import { FaWindowClose } from "react-icons/fa";
import { useNotificationsManager } from "@hooks/useNotifications";
import {
  Notification,
  Button as ButtonType,
} from "@store/notifications/notificationsData";
import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import FlexContainer from "../../FlexContainer/FlexContainer";
import { Button } from "../../Button/Button";
import ButtonsGroup from "../../ButtonsGroup/ButtonsGroup";

const NotificationComponent: FunctionComponent<
  HTMLDivElement,
  { notification: Notification }
> = ({ notification }) => {
  const { deleteNotification } = useNotificationsManager();
  const [notificationTimer, setNotificationTimer] = React.useState<
    number | null
  >(null);

  React.useEffect((): void | (() => void) => {
    if (notificationTimer) {
      return;
    }
    if (notification.time === 0) {
      return;
    }

    setNotificationTimer(
      setTimeout(
        () => deleteNotification(notification.id),
        notification.time
      ) as unknown as number
    );

    // eslint-disable-next-line consistent-return
    return (): void => {
      if (notificationTimer) {
        clearTimeout(notificationTimer);
      }
    };
  }, [
    notificationTimer,
    notification.time,
    notification.id,
    deleteNotification,
  ]);

  return (
    <FlexContainer
      verticallyCentered
      spaceBetween
      css={css`
        margin: 0.25rem 0;
        padding: 1rem;
        width: calc(100% - 2rem);
        border-radius: 5px;
        background-color: var(--notification-${notification.type}-color);

        p,
        span {
          color: black;
        }

        svg {
          fill: black;
        }
      `}
    >
      {notification.buttons?.length ? (
        <FlexContainer column css={{ marginRight: "1rem" }}>
          <p>{notification.body}</p>
          <ButtonsGroup genericMarginTop>
            {notification.buttons.map((b: ButtonType): React.ReactElement => {
              return (
                <Button key={b.text} onClick={() => b.onClick()}>
                  {b.icon ? b.icon : <></>}
                  <span>{b.text}</span>
                </Button>
              );
            })}
          </ButtonsGroup>
        </FlexContainer>
      ) : (
        <p css={{ marginRight: "1rem" }}>{notification.body}</p>
      )}
      <FaWindowClose
        css={css`
          margin-left: 1rem;
          cursor: pointer;
          transition: fill 500ms;

          &:hover {
            fill: var(--font-color-hover);
          }
        `}
        onClick={() => deleteNotification(notification.id)}
      />
    </FlexContainer>
  );
};

export default NotificationComponent;
