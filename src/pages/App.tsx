import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { i18n } from "../languages/i18n";
import LanguageProvider from "../providers/LanguageProvider/LanguageProvider";
import Navbar from "../components/Navbar/Navbar";
import ThemeProvider from "../providers/ThemeProvider/ThemeProvider";
import UserProvider from "../providers/UserProvider/UserProvider";

const Home = React.lazy(() => import("./Home/Home"));
const Callback = React.lazy(() => import("./Callback/Callback"));
const NotFound = React.lazy(() => import("./NotFound/NotFound"));

export default function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <UserProvider>
            <React.Suspense fallback={<></>}>
              <BrowserRouter>
                <Navbar />

                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/callback" component={Callback} />
                  <Route path="/movies" />
                  <Route path="/series" />
                  <Route path="*" component={NotFound} />
                </Switch>
              </BrowserRouter>
            </React.Suspense>
          </UserProvider>
        </LanguageProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}
