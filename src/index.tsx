import React from "react";
import ReactDOM from "react-dom";
import Suspense from "@components/modules/Suspense/Suspense";
import { Provider } from "react-redux";
import { persistedStore, store } from "@store/Store";
import { PersistGate } from "redux-persist/integration/react";

const IMRMain = React.lazy(() => import("./IMRMain"));

const RootComponent = (): React.ReactElement => {
  return (
    <React.Suspense fallback={<Suspense />}>
      <Provider store={store}>
        <PersistGate persistor={persistedStore}>
          <IMRMain />
        </PersistGate>
      </Provider>
    </React.Suspense>
  );
};

const app = document.createElement("div");
app.className = "app";
document.body.appendChild(app);

ReactDOM.render(<RootComponent />, app);
