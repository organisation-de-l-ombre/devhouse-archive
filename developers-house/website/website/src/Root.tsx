import React, { ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Configuration, UserAPIApi } from "@developers-house/abdera";
import { SVGDefinitions } from "@components/UserAvatarStatus/SVGDefinitions";
import Navigator from "@pages/Navigator";
import { Menu } from "@components/navbar";
import loadable from "@loadable/component";
import ThemeProvider from "@components/ThemeProvider/ThemeProvider";
import "rc-tooltip/assets/bootstrap.css";
import "./transitions.css";
import { i18n } from "i18next";
import clientI18N from "@utilities/i18n";
import { I18nextProvider, useSSR } from "react-i18next";
import { fetch as fetchPolyfill } from "cross-fetch";

const NotificationsArea = loadable(
  () => import("@components/notifications/NotificationsArea")
);

const UserAPI = new UserAPIApi(
  new Configuration({
    fetchApi: fetchPolyfill,
  })
);

const ErrorPage = loadable(() => import("@pages/ErrorPage"));
const I18nSSRHydrator = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSSR((window as any).INSTATE, "en");
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
