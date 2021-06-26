import React, { ReactElement, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Configuration, UserAPIApi } from "@developers-house/abdera";
import { SVGDefinitions } from "@components/UserAvatarStatus/SVGDefinitions";
import Navigator from "@pages/Navigator";
import loadable from "@loadable/component";
import ThemeProvider from "@components/ThemeProvider/ThemeProvider";
import { i18n } from "i18next";
import clientI18N from "@utilities/i18n";
import { I18nextProvider, useSSR } from "react-i18next";
import { fetch as fetchPolyfill } from "cross-fetch";
import { getAbderaEndpoint } from "@utilities/endpoints";
import { useAppSelector } from "@state/hooks";

let token: string | undefined = "";
const UserAPI = new UserAPIApi(
  new Configuration({
    fetchApi: fetchPolyfill,
    basePath: `${getAbderaEndpoint()}/user`,
    middleware: [
      {
        async pre(context) {
          context.init.headers = {
            ...context.init.headers,
            Authorization: `Bearer ${token}`,
          };
          return context;
        },
      },
    ],
  })
);

const ErrorPage = loadable(() => import("@pages/ErrorPage"));
const Menu = loadable(() => import("@components/navbar"));
const NotificationsArea = loadable(
  () => import("@components/notifications/NotificationsArea")
);

const ClientAccesor = () => {
  useSSR(window.INSTATE, window.LANG);
  return <></>;
};
const Accesor = () => {
  const value = useAppSelector((state) => state.account.user?.token);
  // eslint-disable-next-line no-return-assign
  useEffect(() => {
    token = value;
  }, [value]);
  return <></>;
};

export default function Root({
  i18nInstance = clientI18N,
}: {
  i18nInstance?: i18n;
}): ReactElement {
  return (
    <I18nextProvider i18n={i18nInstance}>
      {typeof window !== "undefined" && <ClientAccesor />}
      <Accesor />
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <SVGDefinitions />
        <ThemeProvider>
          <NotificationsArea />
          <Menu />
          <Navigator />
        </ThemeProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
}
export { UserAPI };
