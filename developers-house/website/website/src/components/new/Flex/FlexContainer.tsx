import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";
import { CSSProperties } from "react";

type AlignItems = CSSProperties["alignItems"];
type JustifyItems = CSSProperties["justifyItems"];
type JustifyContent = CSSProperties["justifyContent"];

const Flex = styled("div", {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "color",
})<{
  flexDirection?: "column" | "row";
  flexWrap?: boolean;
  alignItems?: AlignItems;
  justifyItems?: JustifyItems;
  flexReverse?: boolean;
  justifyContent?: JustifyContent;
}>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"}${({ flexReverse }) => (flexReverse ? "-reverse" : "")};
  flex-wrap: ${({ flexWrap }) => (flexWrap ? "wrap" : "nowrap")};
  align-items: ${({ alignItems }) => alignItems || "initial"};
  justify-items: ${({ justifyItems }) => justifyItems || "unset"};
  justify-content: ${({ justifyContent }) => justifyContent || "unset"};
`;

export { Flex };
