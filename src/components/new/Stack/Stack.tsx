import styled from "@emotion/styled";

const Stack = styled("div")<{ wrap?: boolean; direction?: "column" | "row" }>`
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: ${(props) => (props.wrap ? "wrap" : "")}
    ${(props) => props.direction || "column"};
  > * {
    margin-top: 1rem;
  }
  *:first-child {
    margin-top: 0;
  }
  *:last-child {
    margin-bottom: 0;
  }
`;

export { Stack };
