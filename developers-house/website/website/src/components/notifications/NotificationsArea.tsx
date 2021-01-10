import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransitionGroup } from "react-transition-group";
import { Notification, removeNotification } from "state/modules/notifications";
import styles from "./notifications.module.scss";
import "./animations.css";
import NotificationComponent from "./NotificationComponent";

export default function NotificationsArea(): ReactElement {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useDispatch();

  const callback = (notification: Notification) => {
    dispatch(removeNotification(notification.id || ""));
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
