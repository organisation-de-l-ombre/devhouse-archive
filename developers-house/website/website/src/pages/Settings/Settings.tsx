/*
 * The Error page displayed to the user when the website crashes.
 */

import React, {ReactElement, useCallback} from 'react';
import {TitleBox} from "../../components/ui/TitleBox";
import Button from "../../components/ui/Button";
import {useDispatch} from "react-redux";
import {logoutUser} from "../../state/modules/user/actions";

export const Settings = (): ReactElement => {
    const dispatch = useDispatch();
    const logout = useCallback(() => {
        dispatch(logoutUser());
    }, []);

    return <TitleBox>
        We are working on this feature! <br/>
        <Button onClick={logout}>
            Logout
        </Button>
    </TitleBox>;
};
