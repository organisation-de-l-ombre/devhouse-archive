import React from "react";
import globalStyles from "@themes/Global.module.scss";

const FlexContainer: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, children, ...props }) => {
  return (
    <div
      className={`${globalStyles.flex} ${globalStyles["flex-full"]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};

export default FlexContainer;
