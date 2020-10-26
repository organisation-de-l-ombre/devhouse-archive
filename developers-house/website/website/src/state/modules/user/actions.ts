import {ThunkAction} from "redux-thunk";
import {PayloadTypes, User, UserFetched, UserInit, UserTokenReceived} from "./index";
import {NotificationPayloadType} from "../notifications";
import {Action} from "redux";
import * as process from "process";
import {fetchUser} from 'utilities';
import {DefaultRootState} from "react-redux";

function makeId(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function getTokenWithPopup(): Promise<string> {

    const h = window.innerHeight / 1.5;
    const w = window.innerWidth / 2;

    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);

    const options = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`;

    const state = makeId(32);

    localStorage.setItem('state-oauth', state);

    const clientId: string = process.env.REACT_APP_CLIENT_ID || '';
    const redirect = `${document.location.protocol}//${document.location.host}/callback`;
    const apiAudience = 'https://api.developershouse.xyz/';

    const scopes = [
        'profile:view'
    ].join(' ');

    const popupWindow = window.open(
        `http://oauth2.developershouse.xyz/oauth2/auth?response_type=token&client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirect)}&state=${encodeURIComponent(state)}&audience=${encodeURIComponent(apiAudience)}`,
        'Login',
        options);

    return new Promise<string>((resolve, reject) => {

        if (popupWindow === null) {
            return reject('The window failed to open.');
        }

        const channel = new BroadcastChannel('callback');

        const listener = ({data}: MessageEvent): void => {
            if (data.token && data.state) {
                if (data.state === state) {
                    resolve(data.token);
                } else {
                    reject('Invalid state!');
                }
            } else if (data.error) {
                reject(data.error);
            }
            channel.close();
            popupWindow.close();
            window.focus();
        };

        channel.addEventListener('message', listener);
    });
}

export function loginUser(): ThunkAction<void, DefaultRootState, PayloadTypes | NotificationPayloadType, Action<(PayloadTypes | NotificationPayloadType)['type']>> {
    return async (dispatch): Promise<void> => {
        dispatch({
            type: UserInit
        });
        /*
         * Popup open.
         */

        dispatch({
            type: 'NOTIFICATION_PUSH',
            notification: {
                text: 'Please, log-in using the authentication popup.',
                time: 5000,
                level: 'info'
            }
        });

        await getTokenWithPopup()
            .then(async (token) => {
                dispatch({
                    type: UserTokenReceived,
                    token: token
                });

                const user: User = await fetchUser();

                dispatch({
                    type: UserFetched,
                    user: user
                });

                dispatch({
                    type: 'NOTIFICATION_PUSH',
                    notification: {
                        text: `Welcome ${user.username}`,
                        time: 10000,
                        level: 'info'
                    }
                });

            })
            .catch(() => {
                dispatch({
                    type: 'NOTIFICATION_PUSH',
                    notification: {
                        text: 'Failed to log-in using the popup. Please try contact our support by joining our discord server.',
                        time: 10000,
                        level: 'info'
                    }
                });
            });
    };
}

export function logoutUser(): ThunkAction<void, DefaultRootState, PayloadTypes | NotificationPayloadType, Action<(PayloadTypes | NotificationPayloadType)['type']>> {
    return async (dispatch): Promise<void> => {
        dispatch({
            type: 'USER_LOGOUT'
        });

        dispatch({
            type: 'NOTIFICATION_PUSH',
            notification: {
                text: 'Successfully logged out',
                level: 'info',
                time: 1000
            }
        });
    };
}
