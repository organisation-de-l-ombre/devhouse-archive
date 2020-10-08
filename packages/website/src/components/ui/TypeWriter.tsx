import React, {PureComponent, ReactElement} from "react";
import styled, {keyframes} from "styled-components";
import {CustomThemedStyledProps} from "../../modules/themes";

type TypeWriterProps = {
    characterDisplayInterval: number;
};

class TypeWriter extends PureComponent<TypeWriterProps, { text: string }> {
    constructor (props: TypeWriterProps) {
        super(props);

        this.state = {
            text: ""
        };
    }

    render (): ReactElement {
        return <>{this.state.text}</>;
    }

    componentDidMount (): void {
        this.displayString.bind(this)();
    }

    wait (time: number): Promise<void> {
        return new Promise<void>((e) => {
            setTimeout(e, time);
        });
    }

    async displayString (): Promise<void> {
        let currentChar: string | undefined = "";
        let i = 0;
        while (currentChar !== undefined) {
            this.setState({
                text: this.state.text + currentChar
            });
            currentChar = (this.props.children as string)[i];
            i++;
            await this.wait(this.props.characterDisplayInterval);
        }
    }
}

const CursorEffect = keyframes`
  50% { opacity: 0; }
`;

export default styled(TypeWriter)`
  :after {
    content: "";
    width: 2px;
    height: 25px;
    background-color: ${(props: CustomThemedStyledProps): string =>
    props.theme.foreground.page};
    left: 0;
    display: inline-block;
    transform: translateX(5px) translateY(3px);
    top: 10px;
    opacity: 1;
    animation: ${CursorEffect} 1s linear infinite;
    animation-timing-function: steps(1, end);
  }
`;
