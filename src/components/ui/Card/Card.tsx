import React from "react";
import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";

interface CardProps {
  maxWidth?: boolean;
  noPadding?: boolean;
  transparent?: boolean;
}

const Card: FunctionComponent<HTMLDivElement, CardProps> = ({
  maxWidth,
  noPadding,
  transparent,
  ...props
}) => {
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
      {...props}
    />
  );
};

export default Card;
