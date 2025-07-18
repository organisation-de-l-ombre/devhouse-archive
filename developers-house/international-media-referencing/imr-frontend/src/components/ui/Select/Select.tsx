import { css, CSSObject } from "@emotion/react";
import React, { FC } from "react";
import ReactSelect, { Theme } from "react-select";
import { Props } from "react-select/src/Select";

const Select: FC<Props> = ({ className, ...props }) => {
  return (
    <ReactSelect
      css={css`
        outline: none;
        border-color: var(--font-color);
      `}
      theme={(theme: Theme): Theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          neutral0: "var(--secondary-background-color)",
          primary: "var(--font-color-hover)",
          primary25: "var(--secondary-background-color-hover)",
          primary50: "var(--font-color-hover)",
        },
      })}
      styles={{
        control: (provided: CSSObject, { isDisabled }) => ({
          ...provided,
          outline: "none",
          border: "none",
          backgroundColor: "var(--secondary-background-color)",
          color: "var(--font-color)",
          opacity: isDisabled ? "0.4" : "initial",
          cursor: "pointer",
          transition: "opacity 300ms",
          ":hover": {
            outline: "none",
            border: "none",
          },
        }),
        option: (provided: CSSObject) => ({
          ...provided,
          color: "var(--font-color)",
          cursor: "pointer",
        }),
        singleValue: (provided: CSSObject) => ({
          ...provided,
          color: "var(--font-color)",
          cursor: "pointer",
        }),
      }}
      {...props}
    />
  );
};

export default Select;
