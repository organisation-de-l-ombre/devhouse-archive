import React, { lazy, ReactElement, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotificationsDisplayed from "../components/utils/NotificationsDisplayer/NotificationsDisplayed";
import { useSelector } from "react-redux";
import "normalize.css";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { RootState } from "../modules/state/state/state";
import { getThemeOrDefault } from "../modules/themes";
import LoginCallback from "./LoginCallback";
import { Menu } from "../components/navbar";
import { CustomThemedStyledProps } from "../modules/themes";

const HomePage = lazy(() => import("./pages/Home/Home"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const AboutPage = lazy(() => import("./pages/About/About"));
const ProjectsPage = lazy(() => import("./pages/Projects/Projects"));
const MembersPage = lazy(() => import("./pages/Members/Members"));

const GlobalTheme = createGlobalStyle`
  body {
    font-family: 'Poppins', sans-serif;
    color: ${(props: CustomThemedStyledProps): string =>
        props.theme.foreground.page};
    background: ${(props: CustomThemedStyledProps): string =>
        props.theme.background.page};
    text-decoration: none;
  }

  a {
    text-decoration: none;
    color: ${(props: CustomThemedStyledProps): string =>
        props.theme.foreground.page};
  }
  
  button {
    outline: none;
    border: none;
    cursor: pointer;
  }
`;

const PageContainer = styled.div``;

export default function App(): ReactElement {
    const theme = useSelector((store: RootState) => store.theme.theme);
    return (
        <ThemeProvider theme={getThemeOrDefault(theme)}>
            <Router>
                <GlobalTheme />
                <Menu />
                <NotificationsDisplayed />
                <PageContainer>
                    <Suspense fallback={""}>
                        <Switch>
                            <Route path="/" exact>
                                <HomePage />
                            </Route>
                            <Route path="/about" exact>
                                <AboutPage />
                            </Route>
                            <Route path="/projects" exact>
                                <ProjectsPage />
                            </Route>
                            <Route path="/members" exact>
                                <MembersPage />
                            </Route>
                            <Route path="/callback" exact>
                                <LoginCallback />
                            </Route>
                            <Route path="*">
                                <NotFound />
                            </Route>
                        </Switch>
                    </Suspense>

                </PageContainer>
            </Router>
        </ThemeProvider>
    );
}
