const NotificationPop = 'NOTIFICATION_POP';
export const NotificationPush = 'NOTIFICATION_PUSH';
const NotificationReadAll = 'NOTIFICATION_READ_ALL';
const NotificationSetDisabled = 'NOTIFICATION_SET_DISABLED';

export type Notification = {
    level: 'warning' | 'error' | 'information';
    text: string;
    icon?: string;
    buttons?: { click: () => boolean; text: string }[];
    time: number;
};

export interface NotificationsState {
    notifications: Notification[];
    enable: boolean;
}

type NotificationPop = {
    type: typeof NotificationPop;
};

type NotificationPush = {
    type: typeof NotificationPush;
    notification: Notification;
};

type NotificationReadAll = {
    type: typeof NotificationReadAll;
};

type NotificationSetDisabled = {
    type: typeof NotificationSetDisabled;
    disabled: boolean;
};

export type NotificationPayloadType =
    | NotificationPop
    | NotificationPush
    | NotificationReadAll
    | NotificationSetDisabled;

export const defaultState: NotificationsState = {
    notifications: [],
    enable: true
};

export default function reducer (
    state: NotificationsState = defaultState,
    payload: NotificationPayloadType
): NotificationsState {
    switch (payload.type) {
        case NotificationPop:
            state.notifications.pop();
            break;
        case NotificationPush:
            if (state.enable) {
                state.notifications.push(payload.notification);
            }
            break;
        case NotificationReadAll:
            state.notifications = [];
            break;
        case NotificationSetDisabled:
            state.enable = !payload.disabled;
            break;
    }
    return state;
}
