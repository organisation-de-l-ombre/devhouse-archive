import React from "react";
import Loader, { LoaderType } from "react-loaders";
import "loaders.css/src/animations/line-scale.scss";
import { FunctionComponent } from "@typings/FunctionComponent";
import styles from "./GenericLoader.module.scss";
import FlexContainer from "../FlexContainer/FlexContainer";

const GenericLoader: FunctionComponent<
  HTMLDivElement,
  {
    genericMarginTop?: boolean;
    centered?: boolean;
    loaderType?: LoaderType;
  }
> = ({ genericMarginTop, centered, loaderType, children, ...props }) => {
  return (
    <FlexContainer
      maxWidth
      genericMarginTop={genericMarginTop}
      column
      fullCentered={centered}
      css={{ width: "fit-content" }}
      {...props}
    >
      <Loader
        type={loaderType || "line-scale"}
        active
        innerClassName={styles.loader}
      />
      <p css={{ marginTop: "1rem", textAlign: "center" }}>{children}</p>
    </FlexContainer>
  );
};

export default GenericLoader;
