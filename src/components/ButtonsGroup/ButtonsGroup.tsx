import React from "react";
import globalStyles from "../../themes/Global.module.scss";

const ButtonsGroup: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ children, ...props }) => {
  return (
    <div
      className={`${globalStyles.flex} ${globalStyles["border-radius"]}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ButtonsGroup;
