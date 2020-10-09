/*
 * Used to inject the state
 */

import React, {PropsWithChildren, ReactElement, useEffect, useState} from "react";
import {Provider} from "react-redux";
import {Store} from "redux";

async function loadStateAsync (): Promise<Store> {
    const {loadState} = await import('./state/state');
    return loadState();
}

let applicationState: Store;

const StateWrapper = ({children}: PropsWithChildren<unknown>): ReactElement => {
    const [stateLoaded, setStateLoaded] = useState(false);
    useEffect(() => {
        loadStateAsync()
            .then((state) => {
                applicationState = state;
                setStateLoaded(true);
            });
    });

    return stateLoaded ? (<Provider store={applicationState}>
        {children}
    </Provider>) : <></>;
};

export {
    StateWrapper
};
