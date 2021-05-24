import React, { FC } from "react";
import { css } from "@emotion/react";
import { ButtonComponent, FunctionComponent } from "@typings/FunctionComponent";
import { NavLink, NavLinkProps } from "react-router-dom";

interface ButtonProps {
  minimal?: boolean;
}

const styles = (minimal?: boolean) => {
  return css`
    padding: ${minimal ? "0.5rem" : "0.75rem"};
    border: 0.15rem solid var(--font-color-hover);
    border-radius: 5px;
    display: flex;
    align-items: center;
    background-color: var(--primary-background-color);
    transition: color 500ms;
    cursor: pointer;

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
  `;
};

const Button: ButtonComponent<ButtonProps> = ({ minimal, ...props }) => {
  return <button type="button" css={styles(minimal)} {...props} />;
};

const ButtonLink: FC<NavLinkProps & ButtonProps> = ({ minimal, ...props }) => {
  return <NavLink css={styles(minimal)} {...props} />;
};

const ButtonExternalLink: FunctionComponent<HTMLAnchorElement, ButtonProps> = ({
  minimal,
  children,
  ...props
}) => {
  return (
    <a css={styles(minimal)} {...props}>
      {children}
    </a>
  );
};

export { Button, ButtonLink, ButtonExternalLink };
