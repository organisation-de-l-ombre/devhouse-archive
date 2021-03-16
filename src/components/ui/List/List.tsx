import React from "react";
import styles from "./List.module.scss";

const List: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > & { items?: string[] }
> = ({ className, children, items, ...props }) => {
  return (
    <ul
      className={`${styles.list}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {items
        ? items.map(
            (item: string): React.ReactElement => {
              return <li key={item}>{item}</li>;
            }
          )
        : children}
    </ul>
  );
};

export default List;
