import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Notification } from "state/modules/notifications/Types";
import { CSSTransition } from "react-transition-group";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Button } from "../ui/Button/Button";
import ButtonGroup from "../ui/Button/ButtonGroup";
import styles from "./notifications.module.scss";
import { removeNotification } from "../../state/modules/notifications/Actions";

type NotificationCleanup = undefined | (() => void);

const NotificationComponent = (props: {
  notification: Notification;
}): ReactElement => {
  const { notification } = props;
  const dispatch = useDispatch();
  const destroySelf = useCallback(() => {
    dispatch(removeNotification(notification.id || ""));
  }, [dispatch, notification.id]);

  const [timer, setTimer] = useState<number | null>(null);
  useEffect((): NotificationCleanup => {
    if (notification.time !== -1 && !timer) {
      setTimer(
        (setTimeout(() => {
          destroySelf();
        }, notification.time) as unknown) as number
      );
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [notification.time, destroySelf, timer]);

  return (
    <CSSTransition
      timeout={500}
      classNames="notification"
      {...{ ...props, destroy: undefined }}
    >
      <div className={styles.notification}>
        <div>
          {notification.text}
          {notification.buttons && (
            <ButtonGroup style={{ marginTop: "25px" }}>
              {notification.buttons.map(
                (b: { text: string; click: () => void }) => {
                  return (
                    <Button key={b.text} onClick={b.click}>
                      {b.text}
                    </Button>
                  );
                }
              )}
            </ButtonGroup>
          )}
        </div>
        <FaWindowClose
          style={{ color: "red", width: "100%", alignSelf: "top" }}
          onClick={destroySelf}
        />
      </div>
    </CSSTransition>
  );
};

export default NotificationComponent;
