import React, { ReactElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RequestContext, UserAPIApi } from "@developers-house/abdera";
import { SVGDefinitions } from "@components/UserAvatarStatus/SVGDefinitions";
import Navigator from "@pages/Navigator";
import { Menu } from "@components/navbar";
import loadable from "@loadable/component";
import ThemeProvider from "@components/ThemeProvider/ThemeProvider";

const NotificationsArea = loadable(
  () => import("@components/notifications/NotificationsArea")
);

const UserAPI = new UserAPIApi().withPreMiddleware(
  async (context: RequestContext) => {
    return { url: context.url, init: context.init };
  }
);

const ErrorPage = loadable(() => import("@pages/ErrorPage"));

export default function Root(): ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <SVGDefinitions />
      <ThemeProvider>
        <NotificationsArea />
        <Menu />
        <Navigator />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
export { UserAPI };
