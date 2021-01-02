/* eslint-disable */
import React, { ReactElement, useEffect, useState } from "react";
import { Notification } from "state/modules/notifications";
import { CSSTransition } from "react-transition-group";
import { FaWindowClose } from "react-icons/fa";
import { Button } from "../ui/Button";
import ButtonGroup from "../ui/ButtonGroup";
import styles from "./notifications.module.scss";

type Merde = undefined | (() => void);

const NotificationComponent = (props: {
  notification: Notification;
  destroy: () => void;
}): ReactElement => {
  const { notification, destroy } = props;

  const [timer, setTimer] = useState<number | null>(null);
  useEffect((): Merde => {
    if (timer) return;
    if (notification.time !== -1) {
      setTimer(
        (setTimeout(() => {
          destroy();
        }, notification.time) as unknown) as number
      );
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    return undefined;
  }, [notification.time, destroy, timer]);

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
          onClick={() => destroy()}
        />
      </div>
    </CSSTransition>
  );
};

export default NotificationComponent;
