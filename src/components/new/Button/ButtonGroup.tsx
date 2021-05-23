import styled from "@emotion/styled";
import { HTMLProps } from "react";
import { Button, ButtonLink, NavLinkButton } from "./Button";

type ButtonGroupProps = Partial<{
  orientation: "row" | "column";
  outline: boolean;
  flexWrap: boolean;
}> &
  HTMLProps<HTMLButtonElement>;

const ButtonGroup = styled("div")<ButtonGroupProps>`
  display: flex;
  background-color: var(--background-hover-primary);
  border-top: solid 1px var(--background-hover-primary);
  border-left: solid 1px var(--background-hover-primary);
  flex-flow: ${(props) => (props.flexWrap ? "wrap" : "")}
    ${(props) => props.orientation || "row"};
  border-radius: 5px;
  overflow: hidden;

  ${Button}, ${ButtonLink}, ${NavLinkButton} {
    flex: 1;
    border-radius: 0;
    margin: 0 1px 1px 0;
  }
`;

export default ButtonGroup;
