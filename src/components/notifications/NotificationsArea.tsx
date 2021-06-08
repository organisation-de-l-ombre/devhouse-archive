import React, { ReactElement } from "react";
import { TransitionGroup } from "react-transition-group";
import styles from "./notifications.module.scss";
import "./animations.css";
import NotificationComponent from "./NotificationComponent";
import { useNotificationsState } from "../../hooks/useNotifications";

export default function NotificationsArea(): ReactElement {
  const { notifications } = useNotificationsState();

  return (
    <TransitionGroup className={styles.area}>
      {notifications.map((not) => {
        return <NotificationComponent notification={not} key={not.id} />;
      })}
    </TransitionGroup>
  );
}
