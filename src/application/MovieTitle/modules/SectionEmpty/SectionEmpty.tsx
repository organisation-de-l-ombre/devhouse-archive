import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import {
  FlexContainer,
  GenericLoader,
  Card,
  Button,
  ButtonsGroup,
} from "@components/ui";
import { FunctionComponent } from "@typings/FunctionComponent";

const SectionEmpty: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");

  return (
    <FlexContainer minHeight padding pageBodyWidth fullCentered>
      <Card noPadding transparent>
        <GenericLoader>
          <Trans t={t} i18nKey="sectionEmpty.message" />
        </GenericLoader>
        <ButtonsGroup>
          <Button>
            <FaEdit />
            <span>
              <Trans t={t} i18nKey="sectionEmpty.buttons.edit" />
            </span>
          </Button>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default SectionEmpty;
