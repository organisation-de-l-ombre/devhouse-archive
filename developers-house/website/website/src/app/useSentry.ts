import {useEffect} from "react";
import { init } from '@sentry/react';

function useSentry() {
    useEffect(() => {
        init({dsn: "https://27e391d3fdac4bf8aa1b860a64b13b26@o375749.ingest.sentry.io/5389514"});
    }, []);
};

export { 
    useSentry
};