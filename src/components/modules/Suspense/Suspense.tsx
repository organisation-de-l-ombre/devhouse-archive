import React from "react";
import globalStyles from "@themes/Global.module.scss";
import { Trans, useTranslation } from "react-i18next";
import { FlexContainer, GenericLoader } from "../../ui";

const RootSuspense = (): React.ReactElement => {
  return (
    <FlexContainer
      className={`${globalStyles["alignment-full-center"]} ${globalStyles["secondary-padding"]}`}
    >
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
  >
> = ({ className }) => {
  const { t } = useTranslation("components\\modules\\suspense\\suspense");

  return (
    <FlexContainer
      className={`${globalStyles["alignment-full-center"]} ${
        globalStyles["secondary-padding"]
      }${className ? ` ${className}` : ""}`}
    >
      <GenericLoader className={globalStyles["generic-loader"]}>
        <Trans t={t} i18nKey="message" />
      </GenericLoader>
    </FlexContainer>
  );
};

export { RootSuspense, Suspense };
