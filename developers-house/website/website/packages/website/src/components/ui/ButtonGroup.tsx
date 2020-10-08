import styled from "styled-components";
import Button from "./Button";
import {CustomThemedStyledProps} from "../../modules/themes";

type ButtonGroupProps = {
    borderRadius?: string;
    buttonPadding?: string;
    direction?: string;
};

const ButtonGroup = styled.div<ButtonGroupProps>`
    display: flex;
    flex-flow: ${ (props: CustomThemedStyledProps<ButtonGroupProps>): string => props.direction || 'row' } wrap;
    border-radius: ${ (props: CustomThemedStyledProps<ButtonGroupProps>): string => props.borderRadius || '5px' };
    overflow: hidden;
    
    ${Button} {
        flex: 1;
        justify-content: center;
        border-radius: 0;
        padding: ${ (props: CustomThemedStyledProps<ButtonGroupProps>): string =>  props.buttonPadding || '1rem'}
    }
`;

export default ButtonGroup;
