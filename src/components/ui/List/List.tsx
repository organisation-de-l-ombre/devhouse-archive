import React from "react";
import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";

interface ListOptions {
  genericMarginTop?: boolean;
}

const List: FunctionComponent<HTMLUListElement, ListOptions> = ({
  genericMarginTop,
  ...props
}) => {
  return (
    <ul
      css={css`
        ${genericMarginTop && "margin-top: 1rem;"}
        list-style: inside;
      `}
      {...props}
    />
  );
};

export default List;
