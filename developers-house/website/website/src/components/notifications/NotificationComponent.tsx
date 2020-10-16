import React, {ReactElement, useEffect, useState} from "react";
import Button from "../ui/Button";
import ButtonGroup from "../ui/ButtonGroup";
import styled from "styled-components";
import {Notification} from 'state/modules/notifications';
import {CSSTransition} from "react-transition-group";
import {FaWindowClose} from 'react-icons/fa';

const NotificationComponent = (props: { notification: Notification, destroy: Function }): ReactElement => {
    const { notification, destroy } = props;

    const [timer, setTimer] = useState<number | null>(null);

    useEffect(() => {
        if (timer) return;
        setTimer(setTimeout(() => {
            destroy();
        }, notification.time));
        return () => (timer && clearTimeout(timer)) || undefined;
    }, [notification.time, destroy, timer]);

    return (
        <CSSTransition timeout={500} classNames="lst-not"  {...{ ...props, destroy: undefined }} >
            <div>
                <div>
                    {notification.text}
                    {notification.buttons && (
                        <ButtonGroup>
                            { notification.buttons.map(
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
                <FaWindowClose style={{ color: 'red', height: '100%', width: '100%' }} onClick={() => destroy()} />
            </div>
        </CSSTransition>
    )
};

export default styled(NotificationComponent)`
  justify-content: center;
  text-align: left;
  margin: 1%;
  margin-top: 5px;
  border-radius: 5px;
  z-index: 15;
  padding: 1.2rem 1.2rem 1.1rem;
  background-color: white;
  color: black;
  display: grid;
  grid-template-columns: 1fr 20px;
`;
