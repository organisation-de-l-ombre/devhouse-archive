import styled from "styled-components";
import {Button} from "./Button";

type ButtonGroupProps = {
    borderRadius?: string;
    buttonPadding?: string;
    direction?: string;
};

const ButtonGroup = styled.div<ButtonGroupProps>`

    
    .react-ripples {
        flex: 1;
        display: flex;
        button {
            flex: 1;
            position: relative;
            justify-content: center;
            border-radius: 0;
            padding: ${(props): string => props.buttonPadding || '1rem'}
        }
    }
    button {
            flex: 1;
            position: relative;
            justify-content: center;
            border-radius: 0;
            padding: ${(props): string => props.buttonPadding || '1rem'}
    }
`;

export default ButtonGroup;
