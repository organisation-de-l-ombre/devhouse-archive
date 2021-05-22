import React from "react";
import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import classnames from "classnames";

const FlexContainer: FunctionComponent<
  HTMLDivElement,
  {
    widthFull?: boolean;
    heightFull?: boolean;
    minHeight?: boolean;
    padding?: boolean;
    expand?: boolean;
    pageBodyWidth?: boolean;
    column?: boolean;
    wrap?: boolean;
    fullCentered?: boolean;
    horizontallyCentered?: boolean;
    verticallyCentered?: boolean;
  }
> = ({
  widthFull,
  heightFull,
  minHeight,
  padding,
  expand,
  pageBodyWidth,
  column,
  wrap,
  fullCentered,
  horizontallyCentered,
  verticallyCentered,
  className,
  ...props
}) => {
  return (
    <div
      css={css`
        ${widthFull && `width: ${padding ? "calc(100% - 4rem)" : "100%"};`}
        ${heightFull && `height: ${padding ? "calc(100% - 4rem)" : "100%"};`}
        ${minHeight && "min-height: 30rem;"}
        ${padding && "padding: 2rem;"}
        display: flex;
        ${expand && "flex: 1;"}
        ${pageBodyWidth &&
        `
          width: ${padding ? "calc(100% - 4rem)" : "100%"};
          max-width: 75%;
          align-self: center;

          @media screen and (max-width: 700px) {
            max-width: unset;
          }
        `}
        ${column && "flex-direction: column;"}
        ${wrap && "flex-wrap: wrap;"}
        ${fullCentered &&
        `
          justify-content: center;
          align-items: center;
        `}
        ${horizontallyCentered &&
        (column ? "align-items: center;" : "justify-content: center;")}
        ${verticallyCentered &&
        (column ? "justify-content: center;" : "align-items: center;")}
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default FlexContainer;
