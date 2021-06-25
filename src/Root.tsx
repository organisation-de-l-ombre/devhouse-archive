import React, { ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import { SVGDefinitions } from "@components/UserAvatarStatus/SVGDefinitions";
import Navigator from "@pages/Navigator";
import { Menu } from "@components/navbar";
import loadable from "@loadable/component";
import ThemeProvider from "@components/ThemeProvider/ThemeProvider";
import "rc-tooltip/assets/bootstrap.css";
import "./transitions.css";
import { i18n } from "i18next";
import tri18n from "@utilities/i18n";
import { I18nextProvider } from "react-i18next";

const NotificationsArea = loadable(
  () => import("@components/notifications/NotificationsArea")
);

const UserAPI = new UserAPIApi().withPreMiddleware(
  async (context: RequestContext) => {
    return { url: context.url, init: context.init };
  }
);

const ErrorPage = loadable(() => import("@pages/ErrorPage"));

export default function Root({
  i18nInstance = tri18n,
}: {
  i18nInstance?: i18n;
}): ReactElement {
  return (
    <I18nextProvider i18n={i18nInstance}>
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
