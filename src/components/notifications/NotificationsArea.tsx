import React, {ReactElement} from "react";
import {useDispatch, useSelector} from "react-redux";
import {TransitionGroup} from "react-transition-group";
import {Notification, removeNotification} from "state/modules/notifications";
import styled from "styled-components";
import './animations.css';
import NotificationComponent from "./NotificationComponent";

const NotificationZone = styled.div`
    position: fixed;
    justify-content: flex-end;
    text-align: left;
    bottom: 0;
    width: 40%;
    max-height: 30%;
    z-index: 15;
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 640px) {
        width: 100vw;
    }
`;

export default function NotificationsArea(): ReactElement {
    var notifications = useSelector(state => state.notifications.notifications);
    const dispatch = useDispatch();

    const callback = (notification: Notification) => {
        dispatch(removeNotification(notification.id || ''));
    };

    return (
        <NotificationZone>
            <TransitionGroup>
                {
                    notifications.map((not) => {
                        return <NotificationComponent destroy={() => callback(not)} notification={not} key={not.id}/>
                    })
                }
            </TransitionGroup>
        </NotificationZone>
    );
}
