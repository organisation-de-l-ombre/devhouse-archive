import React from "react";
import { FaWindowClose } from "react-icons/all";
import { Notification } from "../../../../store/notifications/Types";
import styles from "./Notification.module.scss";
import Button from "../../Button/Button";
import { useNotificationsManager } from "../../../../hooks/Notifications/Notifications";

const NotificationComponent: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { notification: Notification }
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
      (setTimeout(
        () => deleteNotification(notification.id),
        notification.time
      ) as unknown) as number
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
    <div className={styles.notification}>
      <p>{notification.body}</p>
      <Button
        className={styles.close}
        onClick={() => deleteNotification(notification.id)}
      >
        <FaWindowClose />
      </Button>
    </div>
  );
};

export default NotificationComponent;
