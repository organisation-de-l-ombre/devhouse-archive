import React from "react";
import { FunctionComponent } from "@typings/FunctionComponent";
import { css } from "@emotion/react";
import classnames from "classnames";

const ButtonsGroup: FunctionComponent<
  HTMLDivElement,
  {
    genericMarginTop?: boolean;
    minimal?: boolean;
    expand?: boolean;
  }
> = ({ genericMarginTop, minimal, expand, className, ...props }) => {
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
          border: 0.15rem solid var(--font-color-hover);
          border-radius: 5px;
          display: flex;
          align-items: center;
          ${expand && "flex-grow: 1;"}
          background-color: var(--primary-background-color);
          transition: color 500ms;

          svg {
            margin-right: ${minimal ? "0.5rem" : "0.75rem"};
            min-width: 20px;
            min-height: 20px;
            transition: fill 500ms;
          }

          span {
            transition: color 500ms;
          }

          &:hover {
            color: var(--font-color-hover);

            svg {
              fill: var(--font-color-hover);
            }

            span {
              color: var(--font-color-hover);
            }
          }
        }
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default ButtonsGroup;
