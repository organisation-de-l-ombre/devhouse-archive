import React from "react";
import { FunctionComponent } from "@typings/FunctionComponent";
import { css } from "@emotion/react";

const ButtonsGroup: FunctionComponent<
  HTMLDivElement,
  {
    genericMarginTop?: boolean;
    minimal?: boolean;
    expand?: boolean;
  }
> = ({ genericMarginTop, minimal, expand, ...props }) => {
  return (
    <div
      css={css`
        width: fit-content;
        ${genericMarginTop && "margin-top: 1rem;"}
        display: flex;
        flex-wrap: wrap;

        a,
        button {
          margin: 1rem 1rem 0 0;
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
