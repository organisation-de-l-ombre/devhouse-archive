import React from "react";
import { useTranslation } from "react-i18next";
import { FunctionComponent } from "@typings/FunctionComponent";
import { FlexContainer, GenericLoader } from "../../ui";

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
      <GenericLoader centered>{customText || t("message")}</GenericLoader>
    </FlexContainer>
  );
};

export default SuspenseComponent;
