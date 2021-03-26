// Please keep @sentry's import before the react import
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./application/App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "./languages/i18n";
import Suspense from "./components/modules/Suspense/Suspense";
import { store, persistor } from "./store/Store";

init({
  dsn:
    "https://392ce00de8f64a408fcbf26155ba2e21@o487534.ingest.sentry.io/5595403",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1,
  release: process.env.CI_COMMIT_SHORT_SHA ?? "No Commit Short SHA",
});

const app = document.createElement("div");

app.id = "app";
document.body.appendChild(app);

const RootComponent = (): React.ReactElement => {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<Suspense />}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </React.Suspense>
    </React.StrictMode>
  );
};

ReactDOM.render(<RootComponent />, app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
