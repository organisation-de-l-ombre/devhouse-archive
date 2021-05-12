import React from "react";
import { FaWindowClose } from "react-icons/fa";
import { useNotificationsManager } from "@hooks/Notifications";
import {
  Notification,
  Button as ButtonType,
} from "@store/notifications/notificationsData";
import styles from "./Notification.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import Button from "../../Button/Button";
import ButtonsGroup from "../../ButtonsGroup/ButtonsGroup";

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
    <div
      className={`${styles.notification}${
        styles[notification.type] ? ` ${styles[notification.type]}` : ""
      }`}
    >
      {notification.buttons?.length ? (
        <div
          className={`${globalStyles.flex} ${globalStyles.column} ${styles["margin-right"]}`}
        >
          <p>{notification.body}</p>
          <ButtonsGroup className={styles["buttons-container"]}>
            {notification.buttons.map(
              (b: ButtonType): React.ReactElement => {
                return (
                  <Button key={b.text} onClick={() => b.onClick()}>
                    {b.icon ? b.icon : <></>}
                    <span>{b.text}</span>
                  </Button>
                );
              }
            )}
          </ButtonsGroup>
        </div>
      ) : (
        <p className={styles["margin-right"]}>{notification.body}</p>
      )}
      <Button
        aria-label="Close notification"
        className={styles.close}
        onClick={() => deleteNotification(notification.id)}
      >
        <FaWindowClose />
      </Button>
    </div>
  );
};

export default NotificationComponent;
