import React, { ReactElement } from "react";
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

const UserAPI = new UserAPIApi(
  new Configuration({
    fetchApi: fetchPolyfill,
  })
);

const ErrorPage = loadable(() => import("@pages/ErrorPage"));
const Menu = loadable(() => import("@components/navbar"));
const NotificationsArea = loadable(
  () => import("@components/notifications/NotificationsArea")
);

const I18nSSRHydrator = () => {
  useSSR(window.INSTATE, window.LANG);
  return <></>;
};

export default function Root({
  i18nInstance = clientI18N,
}: {
  i18nInstance?: i18n;
}): ReactElement {
  return (
    <I18nextProvider i18n={i18nInstance}>
      {typeof window !== "undefined" && <I18nSSRHydrator />}
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
