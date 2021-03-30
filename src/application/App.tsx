import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { RouteComponentProps } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import i18n from "../languages/i18n";
import themes from "../themes/Themes.module.scss";
import useTheme from "../hooks/Theme/Theme";
import NotificationsModal from "../components/ui/Notifications/NotificationsModal/NotificationsModal";
import NotificationsGroup from "../components/ui/Notifications/NotificationsGroup/NotificationsGroup";
import useLanguage from "../hooks/Language/Language";
import { useNotificationsState } from "../hooks/Notifications/Notifications";
import Error from "../components/modules/Error/Error";

const queryClient: QueryClient = new QueryClient();

/* Pages or global components */
const Navbar = React.lazy(() => import("../components/modules/Navbar/Navbar"));
const Home = React.lazy(() => import("./Home/Home"));
const AccountRoot = React.lazy(() => import("./Account/AccountRoot"));
const Callback = React.lazy(() => import("./Callback/Callback"));
const MovieRoot = React.lazy(() => import("./MoviePrototype/MovieRoot"));
const NotFound = React.lazy(
  () => import("../components/modules/NotFound/NotFound")
);
const Footer = React.lazy(() => import("../components/modules/Footer/Footer"));

const App = (): React.ReactElement => {
  const { theme } = useTheme();
  const { firstUse } = useNotificationsState();
  const { language } = useLanguage();
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(firstUse);

  React.useEffect(() => {
    const app = document.querySelector("#app");

    if (app) {
      app.className = themes[theme];
    }
  }, [theme]);

  React.useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <I18nextProvider i18n={i18n}>
      <ErrorBoundary FallbackComponent={Error}>
        <QueryClientProvider client={queryClient}>
          <NotificationsModal
            open={notificationsWindowOpen}
            setOpen={setNotificationsWindowOpen}
          />
          <NotificationsGroup />
          <BrowserRouter>
            <Navbar />

            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/account" component={AccountRoot} />
              <Route path="/callback" exact component={Callback} />
              <Route path="/movies" exact />
              <Route path="/series" exact />
              <Route
                path="/movies/title/:title"
                render={(props: RouteComponentProps): React.ReactElement => {
                  return <MovieRoot {...props} />;
                }}
              />
              <Route path="*" component={NotFound} />
            </Switch>

            <Footer />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </I18nextProvider>
  );
};

export default App;
