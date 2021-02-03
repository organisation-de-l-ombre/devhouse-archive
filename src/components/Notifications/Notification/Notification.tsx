import React from "react";
import {
  BsInfoSquareFill,
  RiFileWarningFill,
  BsXSquareFill,
  FaWindowClose,
} from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import { NotificationObject } from "../../../store/notifications/Types";
import { useNotificationsManager } from "../../../hooks/Notifications";
import styles from "./Notification.module.scss";
import Button from "../../Button/Button";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const RenderNotificationType: any = (
  notificationType: "info" | "warning" | "error"
) => {
  switch (notificationType) {
    case "info":
      return <BsInfoSquareFill />;

    case "warning":
      return <RiFileWarningFill />;

    case "error":
      return <BsXSquareFill />;

    default:
      return <></>;
  }
};
const Notification: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { notification: NotificationObject }
> = ({ notification }) => {
  const { deleteNotification } = useNotificationsManager();
  const [notificationTimer, setNotificationTimer] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    if (notificationTimer) {
      return;
    }
    if (notification.time !== 0) {
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

      // eslint-disable-next-line consistent-return
      return undefined;
    }
  }, [
    notificationTimer,
    notification.time,
    notification.id,
    deleteNotification,
  ]);

  return (
    <CSSTransition timeout={500} classNames="notification">
      <div className={styles.notification}>
        <div>
          <RenderNotificationType />
          <p>{notification.body}</p>
        </div>
        <Button
          className={styles.close}
          onClick={() => deleteNotification(notification.id)}
        >
          <FaWindowClose />
        </Button>
      </div>
    </CSSTransition>
  );
};

export default Notification;
