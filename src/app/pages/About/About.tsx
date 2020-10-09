/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {TitleBox} from "../../../components/ui/TitleBox";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../modules/state/state/state";
import Button from "../../../components/ui/Button";
import {loginUser, logoutUser} from "../../../modules/state/state/user/actions";

export default function AboutPage (): any {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    return (
        <>
            <TitleBox>
                Version: {process.env.REACT_APP_VERSION}
                <Button onClick={(): unknown => user.loggedIn ? dispatch(logoutUser()) : dispatch(loginUser())}>
                    { user.loggedIn ? 'Experimental Logout' : 'Experimental Login' }
                </Button>
            </TitleBox>
        </>
    );
}
