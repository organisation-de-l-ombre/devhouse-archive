import React, {ReactElement, useEffect, useState} from "react";
import Button from "../ui/Button";
import ButtonGroup from "../ui/ButtonGroup";
import styles from './notifications.module.scss';
import {Notification} from 'state/modules/notifications';
import {CSSTransition} from "react-transition-group";
import {FaWindowClose} from 'react-icons/fa';

const NotificationComponent = (props: { notification: Notification, destroy: Function }): ReactElement => {
    const {notification, destroy} = props;

    const [timer, setTimer] = useState<number | null>(null);

    useEffect(() => {
        if (timer) return;
        if (notification.time !== -1) {
            setTimer(setTimeout(() => {
                destroy();
            }, notification.time));
            return () => (timer && clearTimeout(timer)) || undefined;
        }
    }, [notification.time, destroy, timer]);

    return (
        <CSSTransition timeout={500} classNames="notification" {...{...props, destroy: undefined}} >
            <div className={styles.notification}>
                <div>
                    {notification.text}
                    {notification.buttons && (
                        <ButtonGroup style={{ marginTop: '25px' }}>
                            {notification.buttons.map(
                                (b: { text: string; click: () => void }, i: number) => {
                                    return (
                                        <Button key={i} onClick={b.click}>
                                            {b.text}
                                        </Button>
                                    );
                                }
                            )}
                        </ButtonGroup>
                    )}
                </div>
                <FaWindowClose style={{color: 'red', width: '100%', alignSelf: 'top'}} onClick={() => destroy()}/>
            </div>
        </CSSTransition>
    )
};

export default NotificationComponent;
