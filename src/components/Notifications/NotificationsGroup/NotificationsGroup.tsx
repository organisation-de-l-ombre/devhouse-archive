import React from "react";
import { TransitionGroup } from "react-transition-group";
import styles from "./NotificationsGroup.module.scss";
import { useNotificationsState } from "../../../hooks/Notifications";
import { NotificationObject } from "../../../store/notifications/Types";
import Notification from "../Notification/Notification";

const NotificationsGroup = (): React.ReactElement => {
  const { notifications } = useNotificationsState();

  return (
    <TransitionGroup className={styles["notifications-group"]}>
      {notifications.map(
        (notification: NotificationObject): React.ReactElement => (
          <Notification notification={notification} />
        )
      )}
    </TransitionGroup>
  );
};

export default NotificationsGroup;
