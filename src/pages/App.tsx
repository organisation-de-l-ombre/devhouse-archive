import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { I18nextProvider } from "react-i18next";
import ApolloClient from "../apollo/ApolloClient";
import generateNotificationID from "../utilities/generateNotificationID";
import i18n from "../languages/i18n";
import themes from "../themes/Themes.module.scss";
import useTheme from "../hooks/Theme";
import useLanguage from "../hooks/Language";
import {
  useNotificationsState,
  useNotificationsManager,
} from "../hooks/Notifications";
import NotificationsModal from "../components/Notifications/NotificationsModal/NotificationsModal";
import NotificationsGroup from "../components/Notifications/NotificationsGroup/NotificationsGroup";

const Navbar = React.lazy(() => import("../components/Navbar/Navbar"));
const Home = React.lazy(() => import("./Home/Home"));
const Account = React.lazy(() => import("./Account/Account"));
const Callback = React.lazy(() => import("./Callback/Callback"));
const MoviePrototype = React.lazy(
  () => import("./MoviePrototype/MoviePrototype")
);
const NotFound = React.lazy(() => import("../components/NotFound/NotFound"));
const Footer = React.lazy(() => import("../components/Footer/Footer"));

const App = (): React.ReactElement => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { config, manager } = useNotificationsState();
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(config.firstUse);
  const { addNotifications } = useNotificationsManager();

  React.useEffect(() => {
    const app = document.querySelector("#app");

    if (app) {
      app.className = themes[theme];
    }
  }, [theme]);
  React.useEffect(() => {
    i18n.changeLanguage(language);
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        time: 5000,
        body: i18n.t("components\\navbar:modal.languageChanged"),
      },
    ]);
  }, [addNotifications, language]);

  return (
    <ApolloProvider client={ApolloClient}>
      <I18nextProvider i18n={i18n}>
        {config.allowNotifications && manager.notifications.length ? (
          <NotificationsGroup />
        ) : (
          <></>
        )}
        <BrowserRouter>
          <NotificationsModal
            open={notificationsWindowOpen}
            setOpen={setNotificationsWindowOpen}
          />
          <Navbar />

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/account" component={Account} />
            <Route path="/callback" exact component={Callback} />
            <Route path="/movies" exact />
            <Route path="/series" exact />
            <Route path="/movies/title/tangled" component={MoviePrototype} />
            <Route path="*" component={NotFound} />
          </Switch>

          <Footer />
        </BrowserRouter>
      </I18nextProvider>
    </ApolloProvider>
  );
};

export default App;
