import React, { useEffect } from "react";
import { manageAuth } from "@lib/manageAuthentication";
import { useTranslation } from "react-i18next";
import useUser from "@hooks/useUser";
import { useHistory } from "react-router";
import { SuspenseComponent } from "@components/modules";

const Login = (): React.ReactElement => {
  const { t } = useTranslation("pages\\login\\login");
  const { user } = useUser();
  const history = useHistory();

  useEffect((): void => {
    if (user) {
      history.push("/");
      return;
    }

    manageAuth();
  }, [history, user]);

  return <SuspenseComponent customText={t("message")} />;
};

export default Login;
