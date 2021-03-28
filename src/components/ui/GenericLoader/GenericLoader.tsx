import React from "react";
import Loader from "react-loaders";
import styles from "./GenericLoader.module.scss";
import "loaders.css/src/animations/line-scale.scss";

const GenericLoader: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className, children, ...props }) => {
  return (
    <div
      className={`${styles["loader-container"]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      <Loader innerClassName={styles.loader} type="line-scale" active />
      <p>{children}</p>
    </div>
  );
};

export default GenericLoader;
