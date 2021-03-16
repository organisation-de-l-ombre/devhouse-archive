import React from "react";
import {
  BsInfoSquareFill,
  RiFileWarningFill,
  BsXSquareFill,
  FaWindowClose,
} from "react-icons/all";
import { CSSTransition } from "react-transition-group";
import { NotificationObject } from "../../../../store/notifications/Types";
import { useNotificationsManager } from "../../../../hooks/Notifications";
import styles from "./Notification.module.scss";
import Button from "../../Button/Button";
import "./Animations.scss";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const RenderNotificationType: any = ({
  notificationType,
}: {
  notificationType: "info" | "warning" | "error";
}) => {
  switch (notificationType) {
    case "info":
      return <BsInfoSquareFill fill="#0E92EE" />;

    case "warning":
      return <RiFileWarningFill fill="#EECA0E" />;

    case "error":
      return <BsXSquareFill fill="#E65555" />;

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
    <CSSTransition timeout={500} classNames="notification">
      <div className={styles.notification}>
        <div>
          <RenderNotificationType notificationType={notification.type} />
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
