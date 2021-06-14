import React from "react";
import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";

interface CardContainerProps {
  noMargin?: boolean;
  direction: "inline" | "column";
}

const CardContainer: FunctionComponent<HTMLDivElement, CardContainerProps> = ({
  noMargin,
  direction,
  ...props
}) => {
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
      {...props}
    />
  );
};

export default CardContainer;
