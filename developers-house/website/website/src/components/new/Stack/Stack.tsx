import styled from "@emotion/styled";
import isPropValid from "@emotion/is-prop-valid";

const Stack = styled("div", {
  shouldForwardProp: (prop) => isPropValid(prop) && prop !== "wrap",
})<{ wrap?: boolean; direction?: "column" | "row" }>`
  > * {
    margin-top: 1rem;
  }
  *:first-of-child {
    margin-top: 0;
  }
  *:last-of-child {
    margin-bottom: 0;
  }
`;

export { Stack };
