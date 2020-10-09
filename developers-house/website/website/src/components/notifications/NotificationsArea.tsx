import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../../modules/state/state/state';
import Notification from "./Notification";

export default function NotificationsArea(): ReactElement {
    const notification = useSelector(
        (state: RootState) => state.notifications.notifications[0]
    );
    const dispatch = useDispatch();
    const enabled = useSelector((state: RootState) => state.notifications.enable);

    if (enabled && notification !== undefined) {
        return (
            <Notification
                key={notification.text}
                notification={notification}
                destroy={(): void => {
                    dispatch({ type: "NOTIFICATION_POP" });
                }}
            />
        );
    } else {
        return <></>;
    }
}
