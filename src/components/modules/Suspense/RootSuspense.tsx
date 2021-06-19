import React from "react";
import { FunctionComponent } from "@typings/FunctionComponent";
import { FlexContainer, GenericLoader } from "../../ui";

const RootSuspense: FunctionComponent<HTMLDivElement> = () => {
  return (
    <FlexContainer minHeight padding expand fullCentered>
      <GenericLoader centered>
        Loading the resource you requested...
      </GenericLoader>
    </FlexContainer>
  );
};

export default RootSuspense;
