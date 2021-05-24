import React, { FC } from "react";
import Loader from "react-loaders";
import styles from "../styles/pages/consent.module.scss";

export const ErrorGate: FC<{ error: Error; loading: boolean }> = ({
  loading,
  error,
  children,
}) => {
  if (error) {
    return <p>{error.message}</p>;
  }

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  return <>{children}</>;
};
