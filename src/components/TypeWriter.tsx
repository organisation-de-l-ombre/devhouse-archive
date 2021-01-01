import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useRef
} from "react";
import styled, { keyframes } from "styled-components";

const wait = (time: number): Promise<void> => {
  return new Promise<void>((e) => {
    setTimeout(e, time);
  });
};

const updateText = (
  index: number,
  children: ReactNode,
  reference: RefObject<HTMLParagraphElement>,
  characterDisplayInterval: number,
  ended?: Function
) => {
  return async () => {
    index++;
    if (children?.toString()[index] && reference.current) {
      try {
        reference.current.innerHTML += children.toString()[index];
        await wait(characterDisplayInterval);
        reference.current.setAttribute(
          "animation-frame",
          "" +
            requestAnimationFrame(
              updateText(
                index,
                children,
                reference,
                characterDisplayInterval,
                ended
              )
            )
        );
        return;
      } catch {
        /* Ignore animation errors */
      }
    }
    if (!children?.toString()[index] && ended) ended();
  };
};

const TypeWriterStructure = ({
  children,
  characterDisplayInterval,
  ended
}: PropsWithChildren<{
  characterDisplayInterval: number;
  ended?: Function;
}>): ReactElement => {
  const reference: RefObject<HTMLParagraphElement> = useRef<any>();
  useEffect(() => {
    if (reference.current) {
      const currentId = reference.current.getAttribute("animation-frame");
      if (currentId) {
        cancelAnimationFrame(Number.parseInt(currentId));
      }
      reference.current.innerHTML = "";
      reference.current.setAttribute(
        "animation-frame",
        "" +
          requestAnimationFrame(
            updateText(-1, children, reference, characterDisplayInterval, ended)
          )
      );
    }
  }, [characterDisplayInterval, children, ended]);

  return <p ref={reference} />;
};

const CursorEffect = keyframes`
  50% { opacity: 0; }
`;

const TypeWriter = styled(TypeWriterStructure)`
  :after {
    content: "";
    width: 2px;
    height: 25px;
    background-color: ${(properties): string =>
      properties.theme.foreground.page};
    left: 0;
    display: inline-block;
    transform: translateX(5px) translateY(3px);
    top: 10px;
    opacity: 1;
    animation: ${CursorEffect} 1s linear infinite;
    animation-timing-function: steps(1, end);
  }
`;

export { TypeWriter };
