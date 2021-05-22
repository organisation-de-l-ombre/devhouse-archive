import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import globalStyles from "@themes/Global.module.scss";
import {
  FlexContainer,
  GenericLoader,
  Card,
  Button,
  ButtonsGroup,
} from "@components/ui";
import { FunctionComponent } from "@typings/FunctionComponent";
import styles from "./SectionEmpty.module.scss";

const SectionEmpty: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\movieTitle\\root");

  return (
    <FlexContainer
      className={`${styles.container} ${globalStyles["page-body-width"]}`}
    >
      <Card className={styles.card}>
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
