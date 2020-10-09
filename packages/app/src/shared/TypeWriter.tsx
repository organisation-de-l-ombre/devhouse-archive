import React, {PropsWithChildren, ReactElement, ReactNode, RefObject, useEffect, useRef} from "react";
import styled, {keyframes} from "styled-components";

const wait = (time: number): Promise<void> => {
    return new Promise<void>((e) => {
        setTimeout(e, time);
    });
};

const updateText = (index: number, children: ReactNode, ref: RefObject<HTMLParagraphElement>, characterDisplayInterval: number, ended?: Function) => {
    return async () => {
        index++;
        if (children?.toString()[index] && ref.current) {
            try {
                ref.current.innerHTML += children.toString()[index];
                await wait(characterDisplayInterval);
                ref.current.setAttribute('animation-frame', '' + requestAnimationFrame(updateText(index, children, ref, characterDisplayInterval, ended)));
                return;
            } catch (_) { /* Ignore animation errors */};
        }
        if (!children?.toString()[index] && ended) ended();
    };
};

const TypeWriterStructure = ({ children, characterDisplayInterval, ended }: PropsWithChildren<{ characterDisplayInterval: number, ended?: Function }>): ReactElement => {
    const ref: RefObject<HTMLParagraphElement> = useRef<any>();

    useEffect(() => {
        if (ref.current) {
            const currentId = ref.current.getAttribute('animation-frame');
            if (currentId) {
                cancelAnimationFrame(parseInt(currentId));
            }
            ref.current.innerHTML = '';
            ref.current.setAttribute('animation-frame', '' + requestAnimationFrame(updateText(-1, children, ref, characterDisplayInterval, ended)));
        }
    }, [children, characterDisplayInterval]);

    return (
        <p ref={ref}></p>
    )
};

const CursorEffect = keyframes`
  50% { opacity: 0; }
`;

const TypeWriter = styled(TypeWriterStructure)`
  :after {
    content: "";
    width: 2px;
    height: 25px;
    background-color: ${(props): string =>
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

export {
    TypeWriter
};
