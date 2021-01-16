import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduwProvider } from "react-redux";
import { i18n } from "../languages/i18n";
import LanguageProvider from "../providers/LanguageProvider/LanguageProvider";
import Navbar from "../components/Navbar/Navbar";
import ThemeProvider from "../providers/ThemeProvider/ThemeProvider";
import Store from "../store/Store";

const Home = React.lazy(() => import("./Home/Home"));
const Account = React.lazy(() => import("./Account/Account"));
const Callback = React.lazy(() => import("./Callback/Callback"));
const NotFound = React.lazy(() => import("../components/NotFound/NotFound"));

export default function App(): React.ReactElement {
  return (
    <ReduwProvider store={Store}>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
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
          </LanguageProvider>
        </I18nextProvider>
      </ThemeProvider>
    </ReduwProvider>
  );
}
