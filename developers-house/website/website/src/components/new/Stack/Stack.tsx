import styled from "@emotion/styled";

const Stack = styled("div")<{ wrap?: boolean; direction?: "column" | "row" }>`
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
