import React from "react";
import globalStyles from "@themes/Global.module.scss";
import { FlexContainer, GenericLoader } from "../../ui";
import styles from "./Suspense.module.scss";

const Suspense: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className }) => {
  return (
    <FlexContainer
      className={`${globalStyles["alignment-full-center"]}${
        className ? ` ${className}` : ""
      }`}
    >
      <GenericLoader className={styles.loader}>
        Loading the resource you requested...
      </GenericLoader>
    </FlexContainer>
  );
};

export default Suspense;
