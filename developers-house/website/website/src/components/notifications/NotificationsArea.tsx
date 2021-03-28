import React, { ReactElement, useCallback } from "react";
import { TransitionGroup } from "react-transition-group";
import { Notification } from "state/modules/notifications/Types";
import styles from "./notifications.module.scss";
import "./animations.css";
import NotificationComponent from "./NotificationComponent";
// eslint-disable-next-line import/order
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../state/modules/notifications/Actions";

export default function NotificationsArea(): ReactElement {
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useDispatch();

  const callback = useCallback(
    (notification: Notification) => {
      dispatch(removeNotification(notification.id || ""));
    },
    [dispatch]
  );

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
