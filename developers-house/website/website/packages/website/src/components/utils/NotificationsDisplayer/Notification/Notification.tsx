import React, {PureComponent, ReactElement} from "react";
import Button from "../../../ui/Button";
import ButtonGroup from "../../../ui/ButtonGroup";
import {Notification} from "../../../../modules/state/state/notifications";
import styled, {keyframes} from "styled-components";
import {CustomThemedStyledProps} from "../../../../modules/themes";

class DisplayNotificationComponent extends PureComponent<{ destroy: Function; notification: Notification },
    { timeout: unknown }> {
    index = 0;

    render (): ReactElement {
        return (
            <div
                {...this.props}
                key={this.props.notification.text + this.index++}
                style={{
                    animationDelay: `0s, ${this.props.notification.time - 1000}ms`
                }}
            >
                {this.props.notification.text}

                {this.props.notification.buttons && (
                    <>
                        <ul/>
                        <ButtonGroup>
                            {this.props.notification.buttons.map(
                                (b: { text: string; click: () => void }, i: number) => {
                                    return (
                                        <Button key={i} onClick={b.click}>
                                            {b.text}
                                        </Button>
                                    );
                                }
                            )}
                        </ButtonGroup>
                    </>
                )}
            </div>
        );
    }

    componentDidUpdate (
        prevProps: Readonly<{ destroy: Function; notification: Notification }>,
        prevState: Readonly<{ timeout: unknown }>
    ): void {
        if (this.state.timeout === undefined) {
            this.setState({
                timeout: setTimeout(() => {
                    this.setState({timeout: undefined});
                    this.props.destroy();
                }, this.props.notification.time)
            });
        }
    }

    componentDidMount (): void {
        this.setState({
            timeout: setTimeout(() => {
                this.setState({timeout: undefined});
                this.props.destroy();
            }, this.props.notification.time)
        });
    }

    componentWillUnmount (): void {
        if (this.state.timeout !== null) {
            clearTimeout(this.state.timeout as NodeJS.Timeout);
        }
    }
}

const BottomDisplayAnimation = keyframes`
    from {
        transform: translateY(100%);
    }
    to {
        transform: none;
    }
`;

const BottomHideAnimation = keyframes`
    from {
        transform: none;
    }
    to {
        transform: translateY(100%);
    }
`;

export default styled(DisplayNotificationComponent)`
  position: fixed;
  justify-content: center;
  text-align: left;
  bottom: 0;
  width: 25em;
  border-radius: 5px;
  z-index: 15;
  box-shadow: black 0px 0px 1px;
  padding: 1.2rem 1.2rem 1.1rem;

  background-color: ${(props: CustomThemedStyledProps): string =>
    props.theme.background.secondary};
  color: ${(props: CustomThemedStyledProps): string =>
    props.theme.foreground.primary};

  animation: ${BottomDisplayAnimation} 1s, ${BottomHideAnimation} 1s;
  animation-timing-function: ease-in-out, ease-in-out;
`;
