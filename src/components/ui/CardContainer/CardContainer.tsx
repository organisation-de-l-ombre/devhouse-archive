import React from "react";
import { css } from "@emotion/react";
import classnames from "classnames";
import { FunctionComponent } from "@typings/FunctionComponent";

const CardContainer: FunctionComponent<
  HTMLDivElement,
  {
    noMargin?: boolean;
    direction: "inline" | "column";
  }
> = ({ noMargin, direction, className, ...props }) => {
  return (
    <div
      css={css`
        ${!noMargin && "margin-top: 1rem;"}
        display: flex;
        ${direction === "inline" && "flex-wrap: wrap;"}
        ${direction === "column" && "flex-direction: column;"}

        > div {
          margin-top: 1rem;
          ${direction === "inline" &&
          `
            margin-right: 1rem;
            flex: 1;
          `}
          ${noMargin &&
          `
            &:first-of-type {
              margin-top: 0 !important;
            }
          `}
        }
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default CardContainer;
