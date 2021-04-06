import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import styles from "./SectionEmpty.module.scss";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import GenericLoader from "../../../../components/ui/GenericLoader/GenericLoader";
import Card from "../../../../components/ui/Card/Card";
import ButtonsGroup from "../../../../components/ui/ButtonsGroup/ButtonsGroup";
import Button from "../../../../components/ui/Button/Button";

const SectionEmpty = (): React.ReactElement => {
  const { t } = useTranslation("pages\\moviePrototype\\root");

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${styles.container} ${globalStyles["page-body-width"]}`}
    >
      <Card className={`${cardStyles.container} ${styles.card}`}>
        <GenericLoader>
          <Trans t={t} i18nKey="sectionEmpty.message" />
        </GenericLoader>
        <ButtonsGroup className={styles["buttons-container"]}>
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
