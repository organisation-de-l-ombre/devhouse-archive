import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { useSelector } from "react-redux";
import i18n from "../languages/i18n";
import Navbar from "../components/Navbar/Navbar";
import { GlobalState } from "../store/Types";
import { Theme } from "../store/theme/Types";
import themes from "../themes/Themes.module.scss";
import { Language } from "../store/language/Types";

const Home = React.lazy(() => import("./Home/Home"));
const Account = React.lazy(() => import("./Account/Account"));
const Callback = React.lazy(() => import("./Callback/Callback"));
const NotFound = React.lazy(() => import("../components/NotFound/NotFound"));

export default function App(): React.ReactElement {
  const theme = useSelector((state: GlobalState): Theme => state.theme.theme);
  const language = useSelector(
    (state: GlobalState): Language => state.language.language
  );

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
      <BrowserRouter>
        <Navbar />

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/account" component={Account} />
          <Route path="/callback" exact component={Callback} />
          <Route path="/movies" exact />
          <Route path="/series" exact />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </I18nextProvider>
  );
}
