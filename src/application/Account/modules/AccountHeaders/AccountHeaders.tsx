import React from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./AccountHeaders.module.scss";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import useUser from "../../../../hooks/User/User";
import { getAvatar } from "../../../../store/user/Login";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";

const AccountHeaders = (): React.ReactElement => {
  const { user } = useUser();
  const { t } = useTranslation("application\\account\\headers");

  return user ? (
    <FlexContainer
      className={`${flexContainerStyles.container} ${styles.headers}`}
    >
      <img src={getAvatar(user.avatar)} alt={`Avatar of ${user.username}`} />
      <FlexContainer
        className={`${flexContainerStyles.container} ${styles["headers-text"]}`}
      >
        <h2>
          <Trans t={t} i18nKey="title" values={{ username: user.username }} />
        </h2>
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
      </FlexContainer>
    </FlexContainer>
  ) : (
    <></>
  );
};

export default AccountHeaders;
