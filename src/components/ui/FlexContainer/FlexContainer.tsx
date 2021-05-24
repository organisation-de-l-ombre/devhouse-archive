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
    maxHeight?: boolean;
    genericMarginTop?: boolean;
    padding?: boolean;
    expand?: boolean;
    pageBodyWidth?: boolean;
    column?: boolean;
    allowWrap?: boolean;
    fullCentered?: boolean;
    horizontallyCentered?: boolean;
    verticallyCentered?: boolean;
    spaceBetween?: boolean;
  }
> = ({
  widthFull,
  heightFull,
  minHeight,
  maxHeight,
  genericMarginTop,
  padding,
  expand,
  pageBodyWidth,
  column,
  allowWrap,
  fullCentered,
  horizontallyCentered,
  verticallyCentered,
  spaceBetween,
  className,
  ...props
}) => {
  return (
    <div
      css={css`
        ${widthFull && `width: ${padding ? "calc(100% - 4rem)" : "100%"};`}
        ${heightFull && `height: ${padding ? "calc(100% - 4rem)" : "100%"};`}
        ${minHeight && "min-height: 30rem;"}
        ${maxHeight && "max-height: calc(100vh - 3.5rem);"}
        ${genericMarginTop && "margin-top: 1rem;"}
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
        ${allowWrap && "flex-wrap: wrap;"}
        ${fullCentered &&
        `
          justify-content: center;
          align-items: center;
        `}
        ${horizontallyCentered &&
        (column ? "align-items: center;" : "justify-content: center;")}
        ${verticallyCentered &&
        (column ? "justify-content: center;" : "align-items: center;")}
        ${spaceBetween && "justify-content: space-between;"}
      `}
      className={classnames(className)}
      {...props}
    />
  );
};

export default FlexContainer;
