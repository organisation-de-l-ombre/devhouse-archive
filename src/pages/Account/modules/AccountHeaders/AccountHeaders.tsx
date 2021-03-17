import React from "react";
import { Trans, useTranslation } from "react-i18next";
import styles from "./AccountHeaders.module.scss";
import useUser from "../../../../hooks/User";
import { getAvatar } from "../../../../store/user/Login";

const AccountHeaders = (): React.ReactElement => {
  const { user } = useUser();
  const { t } = useTranslation("pages\\account\\headers");

  return user ? (
    <div className={styles.headers}>
      <img src={getAvatar(user.avatar)} alt={`Avatar of ${user.username}`} />
      <div className={styles["headers-text"]}>
        <h2>
          <Trans t={t} i18nKey="title" values={{ username: user.username }} />
        </h2>
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AccountHeaders;
