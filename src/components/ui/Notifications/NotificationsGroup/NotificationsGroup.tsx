import React from "react";
import { GlobalState } from "store/Types";
import { useSelector } from "react-redux";
import styles from "./NotificationsGroup.module.scss";
import { NotificationObject } from "../../../../store/notifications/Types";
import Notification from "../Notification/Notification";

const NotificationsGroup = (): React.ReactElement => {
  const notifications = useSelector(
    (state: GlobalState) => state.notificationsManager.notifications
  );

  return (
    <div className={styles["notifications-group"]}>
      {notifications.map(
        (notification: NotificationObject): React.ReactElement => (
          <Notification key={notification.id} notification={notification} />
        )
      )}
    </div>
  );
};

export default NotificationsGroup;
