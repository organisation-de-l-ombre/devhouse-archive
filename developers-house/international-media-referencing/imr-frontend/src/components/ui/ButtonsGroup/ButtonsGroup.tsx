import React from "react";
import { FunctionComponent } from "@typings/FunctionComponent";
import { css } from "@emotion/react";
import { detectMobileDevice } from "@lib/utils";

interface ButtonsGroupProps {
  genericMarginTop?: boolean;
  minimal?: boolean;
  expand?: boolean;
}

const ButtonsGroup: FunctionComponent<HTMLDivElement, ButtonsGroupProps> = ({
  genericMarginTop,
  minimal,
  expand,
  ...props
}) => {
  if (detectMobileDevice()) {
    minimal = true;
  }

  return (
    <div
      css={css`
        width: fit-content;
        ${genericMarginTop && `margin-top: ${minimal ? "0.25" : "1"}rem;`}
        display: flex;
        flex-wrap: wrap;

        a,
        button {
          margin-top: ${minimal ? "0.75rem" : "1rem"};
          margin-right: ${minimal ? "0.75rem" : "1rem"};
          padding: ${minimal ? "0.5rem" : "0.75rem"};
          ${expand && "flex-grow: 1;"}

          svg {
            margin-right: ${minimal ? "0.5rem" : "0.75rem"};
          }
        }
      `}
      {...props}
    />
  );
};

export default ButtonsGroup;
