import React from "react";
import Loader, { LoaderType } from "react-loaders";
import styles from "./GenericLoader.module.scss";
import "loaders.css/src/animations/line-scale.scss";

const GenericLoader: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { loaderType?: LoaderType }
> = ({ className, loaderType, children, ...props }) => {
  return (
    <div
      className={`${styles["loader-container"]}${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      <Loader
        innerClassName={styles.loader}
        type={loaderType || "line-scale"}
        active
      />
      <p>{children}</p>
    </div>
  );
};

export default GenericLoader;
