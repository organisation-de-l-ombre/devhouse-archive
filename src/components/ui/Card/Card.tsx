import React from "react";
import { css } from "@emotion/react";
import classnames from "classnames";
import { FunctionComponent } from "@typings/FunctionComponent";

const Card: FunctionComponent<HTMLDivElement, { transparent?: boolean }> = ({
  transparent,
  className,
  ...props
}) => {
  return (
    <div
      css={css`
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        background-color: ${transparent
          ? "transparent"
          : "var(--primary-background-color)"};
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default Card;
