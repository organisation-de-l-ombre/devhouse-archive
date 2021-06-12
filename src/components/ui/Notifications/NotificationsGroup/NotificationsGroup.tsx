import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useNotificationsState } from "@hooks/useNotifications";
import { Notification } from "@store/notifications/notificationsData/types";
import styles from "./NotificationsGroup.module.scss";
import NotificationComponent from "../Notification/Notification";
import "./Animations.scss";

const NotificationsGroup = (): React.ReactElement => {
  const { notifications } = useNotificationsState();

  return (
    <TransitionGroup className={styles["notifications-group"]}>
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
