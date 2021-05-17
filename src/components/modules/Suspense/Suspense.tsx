import React from "react";
import globalStyles from "@themes/Global.module.scss";
import { useTranslation } from "react-i18next";
import styles from "./Suspense.module.scss";
import { FlexContainer, GenericLoader } from "../../ui";

const RootSuspense = (): React.ReactElement => {
  return (
    <FlexContainer className={styles.suspense}>
      <GenericLoader className={globalStyles["generic-loader"]}>
        Loading the resource you requested...
      </GenericLoader>
    </FlexContainer>
  );
};

const Suspense: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { minHeight?: boolean; customText?: string }
> = ({ minHeight, customText }) => {
  const { t } = useTranslation("components\\modules\\suspense\\suspense");

  return (
    <div
      className={`${styles.suspense}${
        minHeight ? ` ${styles["min-height"]}` : ""
      }`}
    >
      <GenericLoader className={globalStyles["generic-loader"]}>
        {customText || t("message")}
      </GenericLoader>
    </div>
  );
};

export { RootSuspense, Suspense };
