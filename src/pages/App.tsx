import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { RouteComponentProps } from "react-router/ts4.0";
import { useDispatch, useSelector } from "react-redux";
import i18n from "../languages/i18n";
import themes from "../themes/Themes.module.scss";
import useTheme from "../hooks/Theme";
import NotificationsModal from "../components/ui/Notifications/NotificationsModal/NotificationsModal";
import NotificationsGroup from "../components/ui/Notifications/NotificationsGroup/NotificationsGroup";
import { GlobalState } from "../store/Types";
import { pushNotifications } from "../store/notifications/Actions";
import generateNotificationID from "../utilities/generateNotificationID";

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
  const globalState: GlobalState = useSelector(
    (state: GlobalState): GlobalState => state
  );
  const {
    notificationsConfig: config,
    notificationsManager: manager,
  } = globalState;
  const { language } = globalState.language;
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(config.firstUse);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const app = document.querySelector("#app");

    if (app) {
      app.className = themes[theme];
    }
  }, [theme]);
  React.useEffect(() => {
    i18n.changeLanguage(language);
    dispatch(
      pushNotifications([
        {
          id: generateNotificationID(),
          type: "info",
          body: i18n.t("components\\navbar:modal.languageChanged"),
          time: 5000,
        },
      ])
    );
  }, [dispatch, language]);

  return (
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
    </I18nextProvider>
  );
};

export default App;
