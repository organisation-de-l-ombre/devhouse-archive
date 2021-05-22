import React from "react";
import { css } from "@emotion/react";
import classnames from "classnames";
import { FunctionComponent } from "@typings/FunctionComponent";

const CardContainer: FunctionComponent<
  HTMLDivElement,
  { direction: "inline" | "column" }
> = ({ direction, className, ...props }) => {
  return (
    <div
      css={css`
        margin-top: 1rem;
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
        }
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default CardContainer;
