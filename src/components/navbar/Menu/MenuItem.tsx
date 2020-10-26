/*
 * A simple menu item component for the Menu.
 */

import styled from "styled-components";

export default styled.div`
    display: inline-block;
    padding: 1rem;
    cursor: pointer;
    &:hover, &.active {
        background-color: ${(props): string => props.theme.background.hover.secondary};
    }
`;

