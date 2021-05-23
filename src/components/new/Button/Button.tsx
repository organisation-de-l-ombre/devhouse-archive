import { HTMLProps } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const sizes = {
  large: `
    padding: 1rem;
  `,
  small: `
    padding: 0.25rem;
  `,
};

export type ButtonProps = Partial<{
  outline: boolean;
  size: keyof typeof sizes;
  fullWidth: boolean;
}> &
  HTMLProps<HTMLButtonElement>;

export const outlined = `
  border: solid 2px var(--background-hover-primary);
`;

const Button = styled("button")<ButtonProps>`
  border-radius: 5px;
  background-color: var(--background-primary);
  color: var(--foreground-primary);

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 16px;

  :hover {
    background-color: var(--background-hover-primary);
  }
  :disabled {
    background-color: var(--background-hover-secondary);
  }

  > img,
  > svg {
    margin-right: 0.45rem;
    transform: scale(1.25);
  }

  ${(props) => sizes[props.size || "large"]}
  ${(props) => props.outline && outlined}
`;

const ButtonLink = Button.withComponent("a");
const ButtonImage = styled("img")`
  display: inline-block;
  height: 100%;
`;
const NavLinkButton = Button.withComponent(NavLink);

export { Button, ButtonLink, ButtonImage, NavLinkButton };
