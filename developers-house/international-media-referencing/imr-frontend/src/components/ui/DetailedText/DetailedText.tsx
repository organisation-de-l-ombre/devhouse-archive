import { FunctionComponent } from "@typings/FunctionComponent";
import React from "react";
import { css } from "@emotion/react";
import FlexContainer from "../FlexContainer/FlexContainer";

const DetailedText: FunctionComponent<HTMLDivElement> = ({ ...props }) => {
  return (
    <FlexContainer
      column
      css={css`
        margin-top: 4rem;

        p {
          margin-top: 2rem;
          line-height: 1.5;
        }
      `}
      {...props}
    />
  );
};

export default DetailedText;
