import styled from "styled-components";
import {Button} from "./Button";

type ButtonGroupProps = {
    borderRadius?: string;
    buttonPadding?: string;
    direction?: string;
};

const ButtonGroup = styled.div<ButtonGroupProps>`
    display: flex;
    flex-flow: ${ (props): string => props.direction || 'row' } wrap;
    border-radius: ${ (props): string => props.borderRadius || '5px' };
    overflow: hidden;
    
    ${Button} {
        flex: 1;
        position: relative;
        justify-content: center;
        border-radius: 0;
        padding: ${ (props): string =>  props.buttonPadding || '1rem'}
    }
`;

export default ButtonGroup;
