import React, { ComponentType, ReactElement, useEffect } from "react";
import { useAccount } from "@hooks/useAccount";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useNotificationsManager } from "@hooks/useNotifications";

function withAccount<Props>(Component: ComponentType<Props>) {
  return (props: Props): ReactElement => {
    const history = useHistory();
    const { addNotifications } = useNotificationsManager();
    const { t } = useTranslation("root");
    const user = useAccount();

    useEffect((): void => {
      if (!user) {
        history.push("/");

        addNotifications([
          {
            type: "warning",
            body: t("notifications.accountRequired"),
            time: 5000,
          },
        ]);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return <Component {...props} />;
  };
}

export default withAccount;
