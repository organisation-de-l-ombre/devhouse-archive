import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { useEffect } from "react";
import { ThemeContext } from "../themes/ThemeContext";
import themes from "../themes/Themes.module.scss";
import { Navbar } from "../components/Navbar/Navbar";

const Home = React.lazy(() => import("./Home/Home"));

export default function App(): React.ReactElement {
  const [theme, setTheme] = React.useState(
    window.localStorage.getItem("theme") ?? "light"
  );
  const changeTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);

    const app = document.querySelector("#app");

    if (app) {
      app.className = themes[theme];
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <React.Suspense fallback={<></>}>
        <BrowserRouter>
          <Navbar />

          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/movies" />
            <Route path="/series" />
          </Switch>
        </BrowserRouter>
      </React.Suspense>
    </ThemeContext.Provider>
  );
}
