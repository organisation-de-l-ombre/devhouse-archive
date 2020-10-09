/*
 * A simple menu item component for the Menu.
 */

import React, {PropsWithChildren, ReactElement} from "react";
import styled from "styled-components";

const MenuItem = (props: PropsWithChildren<any>): ReactElement => {
    return (
        <div {...props}>
            { props.children }
        </div>
    );
};

export default styled(MenuItem)`
    display: inline-block;
    padding: 1rem;
    &:hover, &.active {
        background-color: ${(props): string => props.theme.background.hover.secondary};
    }
`;

