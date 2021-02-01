import React from "react";
import { TiArrowSortedDown } from "react-icons/all";
import styles from "./SelectList.module.scss";
import globalStyles from "../../themes/Global.module.scss";

const manageSelection = (id: string, display: "flex" | "none"): void => {
  const item = document.getElementById(id);

  if (item) {
    item.style.display = display;
  }
};
const SelectList: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > & { defaultTitle: React.ReactElement; id: string }
> = ({ className, defaultTitle, children, id }) => {
  return (
    <div
      className={`${styles["select-list"]}${className ? ` ${className}` : ""}`}
      onMouseEnter={() => manageSelection(id, "flex")}
      onMouseLeave={() => manageSelection(id, "none")}
    >
      <div>
        <span className={globalStyles["text-align-center"]}>
          {defaultTitle}
        </span>
        <TiArrowSortedDown />
      </div>
      <ul id={id} style={{ display: "none" }}>
        {children}
      </ul>
    </div>
  );
};

export default SelectList;
export { manageSelection };
