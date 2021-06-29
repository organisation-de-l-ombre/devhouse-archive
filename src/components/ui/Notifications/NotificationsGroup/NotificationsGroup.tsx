import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNotificationsState } from "@hooks/useNotifications";
import { Notification } from "@store/notifications/notificationsData/types";
import { css } from "@emotion/react";
import NotificationComponent from "../Notification/Notification";
import "./Animations.scss";

const NotificationsGroup = (): React.ReactElement => {
  const { notifications } = useNotificationsState();

  return (
    <TransitionGroup
      css={css`
        z-index: 11;
        width: 60%;
        max-width: 50rem;
        max-height: calc(100vh - 5.5rem);
        display: flex;
        flex-direction: column;
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        overflow: hidden;

        @media screen and (max-width: 700px) {
          width: auto;
          left: 1rem;
        }
      `}
    >
      {notifications.map(
        (notification: Notification): React.ReactElement => (
          <CSSTransition
            key={notification.id}
            timeout={300}
            classNames="notification"
          >
            <NotificationComponent notification={notification} />
          </CSSTransition>
        )
      )}
    </TransitionGroup>
  );
};

export default NotificationsGroup;
