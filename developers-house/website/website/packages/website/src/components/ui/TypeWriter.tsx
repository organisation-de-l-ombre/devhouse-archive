import React, {PropsWithChildren, ReactElement, RefObject, useEffect, useRef, useState} from "react";
import styled, {keyframes} from "styled-components";
import {CustomThemedStyledProps} from "../../modules/themes";

type TypeWriterProps = {
    characterDisplayInterval: number;
};

const wait = (time: number): Promise<void> => {
    return new Promise<void>((e) => {
        setTimeout(e, time);
    });
};

const TypeWriter = ({ children, characterDisplayInterval }: PropsWithChildren<{ characterDisplayInterval: number }>): ReactElement => {
    const ref: RefObject<HTMLParagraphElement> = useRef<any>();

    const updateText = (index: number) => {
        return async () => {
            index++;
            if (children?.toString()[index] && ref.current) {
                ref.current.innerHTML += children.toString()[index];
                await wait(characterDisplayInterval);
                ref.current.setAttribute('animation-frame', '' + requestAnimationFrame(updateText(index)));
            }
        };
    };

    useEffect(() => {
        if (ref.current) {
            const currentId = ref.current.getAttribute('animation-frame');
            if (currentId) {
                cancelAnimationFrame(parseInt(currentId));
            }
            ref.current.setAttribute('animation-frame', '' + requestAnimationFrame(updateText(-1)));
        }
    }, [children, characterDisplayInterval]);

    return (
        <p ref={ref}></p>
    )
};

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
