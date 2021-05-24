import React from "react";
import globalStyles from "@styles/Global.module.scss";
import { useTranslation } from "react-i18next";
import { FunctionComponent } from "@typings/FunctionComponent";
import { FlexContainer, GenericLoader } from "../../ui";

const RootSuspense: FunctionComponent<HTMLDivElement> = () => {
  return (
    <FlexContainer minHeight padding expand fullCentered>
      <GenericLoader className={globalStyles["generic-loader"]}>
        Loading the resource you requested...
      </GenericLoader>
    </FlexContainer>
  );
};

const SuspenseComponent: FunctionComponent<
  HTMLDivElement,
  {
    minHeight?: boolean;
    pageBodyWidth?: boolean;
    customText?: string;
  }
> = ({ minHeight, pageBodyWidth, customText }) => {
  const { t } = useTranslation("components\\modules\\suspense\\suspense");

  return (
    <FlexContainer
      minHeight={minHeight}
      padding
      expand
      pageBodyWidth={pageBodyWidth}
      fullCentered
    >
      <GenericLoader className={globalStyles["generic-loader"]}>
        {customText || t("message")}
      </GenericLoader>
    </FlexContainer>
  );
};

export { RootSuspense, SuspenseComponent };
