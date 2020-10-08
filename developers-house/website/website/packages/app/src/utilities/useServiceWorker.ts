import {useEffect, useState} from "react";
import { register } from "./serviceWorker";

function useServiceWorker() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        const onSuccess = () => setRegistered(true);
        const onUpdate = () => setUpdateAvailable(true);
        register({
            onSuccess,
            onUpdate
        });
    }, []);

    return {
        updateAvailable,
        registered
    };
};

export { 
    useServiceWorker
};