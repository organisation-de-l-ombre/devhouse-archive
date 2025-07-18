import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import React from "react";
import FlexContainer from "../FlexContainer/FlexContainer";

const TextArea: FunctionComponent<HTMLDivElement> = ({ ...props }) => {
  return (
    <FlexContainer
      expand
      column
      css={css`
        margin: 1rem 1rem 0 0;
        display: flex;
        flex: 1;
        flex-direction: column;

        h3 {
          margin-bottom: 1rem;
        }

        input,
        textarea,
        p,
        span {
          padding: 0.5rem;
          border-radius: 5px;
          border: none;
          background-color: var(--primary-background-color-hover);
          flex: 1;
        }
      `}
      {...props}
    />
  );
};

export default TextArea;
