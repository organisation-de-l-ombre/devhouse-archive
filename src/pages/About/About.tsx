import React, { ReactElement } from "react";
import {TitleBox} from "components/ui/TitleBox";

export default function AboutPage (): ReactElement {
    return (
        <>
            <TitleBox>
                Version: {process.env.REACT_APP_VERSION}
            </TitleBox>
        </>
    );
}
