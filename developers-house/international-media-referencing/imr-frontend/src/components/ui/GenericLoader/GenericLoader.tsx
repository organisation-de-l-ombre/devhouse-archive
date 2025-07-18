import React from "react";
import { FunctionComponent } from "@typings/FunctionComponent";
import { AiOutlineLoading } from "react-icons/ai";
import { css, keyframes } from "@emotion/react";
import FlexContainer from "../FlexContainer/FlexContainer";

interface GenericLoaderProps {
  genericMarginTop?: boolean;
  centered?: boolean;
  loaderWidth?: number;
  loaderHeight?: number;
}

const loaderAnimation = keyframes`
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
`;

const GenericLoader: FunctionComponent<HTMLDivElement, GenericLoaderProps> = ({
  genericMarginTop,
  centered,
  loaderWidth = 30,
  loaderHeight = 30,
  children,
  ...props
}) => {
  return (
    <FlexContainer
      maxWidth
      genericMarginTop={genericMarginTop}
      column
      fullCentered={centered}
      css={{ width: "fit-content" }}
      {...props}
    >
      <AiOutlineLoading
        css={css`
          width: ${loaderWidth}px;
          height: ${loaderHeight}px;
          animation: ${loaderAnimation} 1s infinite;
        `}
      />
      <p css={{ marginTop: "1rem", textAlign: "center" }}>{children}</p>
    </FlexContainer>
  );
};

export default GenericLoader;
