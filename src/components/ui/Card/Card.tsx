import React from "react";
import { css } from "@emotion/react";
import classnames from "classnames";
import { FunctionComponent } from "@typings/FunctionComponent";

const Card: FunctionComponent<
  HTMLDivElement,
  {
    maxWidth?: boolean;
    noPadding?: boolean;
    transparent?: boolean;
  }
> = ({ maxWidth, noPadding, transparent, className, ...props }) => {
  return (
    <div
      css={css`
        ${maxWidth && "max-width: 40rem;"}
        ${!noPadding && "padding: 1.5rem;"}
        display: flex;
        flex-direction: column;
        background-color: ${transparent
          ? "transparent"
          : "var(--primary-background-color)"};
        border-radius: 5px;

        p {
          line-height: 1.5;
        }

        code {
          background-color: ${transparent
            ? "var(--primary-background-color)"
            : "var(--secondary-background-color)"};
        }
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default Card;
