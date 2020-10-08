import React, {ReactElement, useEffect} from "react";

export default function LoginCallback (): ReactElement {
    useEffect(() => {
        const windowHash = new URLSearchParams(window.location.hash.slice(1));

        const accessToken = windowHash.get('access_token');
        const state = windowHash.get('state');

        const channel = new BroadcastChannel('callback');

        if (accessToken && state) {

            channel.postMessage({
                token: accessToken,
                state
            });
        } else {
            const error = windowHash.get('error_description') || 'Unknown error';

            channel.postMessage({
               error
            });
        }
        channel.close();
        window.close();

    }, []);

    return <></>;
}
