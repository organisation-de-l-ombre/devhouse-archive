import React, { HTMLProps } from "react";
import styles from "./title.module.scss";

const Header: React.FC<HTMLProps<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={[className, styles.title].join(" ")} {...props} />;

export { Header };
