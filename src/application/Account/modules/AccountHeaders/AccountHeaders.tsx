import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { useUser } from "@hooks/User";
import { getAvatar } from "@lib/manageAuthentication";
import { FlexContainer } from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import styles from "./AccountHeaders.module.scss";

const AccountHeaders = (): React.ReactElement => {
  const { user } = useUser();
  const { t } = useTranslation("pages\\account\\headers");

  return user ? (
    <div className={styles.background}>
      <FlexContainer
        className={`${styles.headers} ${globalStyles["page-body-width"]}`}
      >
        <img src={getAvatar(user.avatar)} alt={`Avatar of ${user.username}`} />
        <FlexContainer className={styles["headers-text"]}>
          <h2>
            <Trans t={t} i18nKey="title" values={{ username: user.username }} />
          </h2>
          <p>
            <Trans t={t} i18nKey="description" />
          </p>
        </FlexContainer>
      </FlexContainer>
    </div>
  ) : (
    <></>
  );
};

export default AccountHeaders;
