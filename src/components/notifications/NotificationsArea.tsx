import React, { ReactElement } from "react";
import { TransitionGroup } from "react-transition-group";
import { Notification } from "state/modules/notifications/Types";
import styles from "./notifications.module.scss";
import "./animations.css";
import NotificationComponent from "./NotificationComponent";
import {
  useNotificationsManager,
  useNotificationsState,
} from "../../hooks/Notifications/Notifications";

export default function NotificationsArea(): ReactElement {
  const { notifications } = useNotificationsState();
  const { deleteNotification } = useNotificationsManager();

  const callback = (notification: Notification) => {
    deleteNotification(notification.id || "");
  };

  return (
    <TransitionGroup className={styles.area}>
      {notifications.map((not) => {
        return (
          <NotificationComponent
            destroy={() => callback(not)}
            notification={not}
            key={not.id}
          />
        );
      })}
    </TransitionGroup>
  );
}
