/*
 * The Error page displayed to the user when the website crashes.
 */

import React, {ReactElement, useEffect} from 'react';

const Callback = (): ReactElement => {
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params: {
            [key: string]: string;
        } = {};
        hash.split('&').forEach(hk => {
            let temp = hk.split('=');
            params[temp[0]] = temp[1]
        });

        if (params['access_token'] && params['state']) {
            if (localStorage.getItem('state-oauth') === params['state']) {
                localStorage.removeItem('state-oauth');
                const channel = new BroadcastChannel('callback');
                channel.postMessage({
                    token: params['access_token'],
                    state: params['state'],
                });
            }
        }
    });

    return <></>;
};

export default Callback;
