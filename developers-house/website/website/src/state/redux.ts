import { configureStore } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { Action, AnyAction } from "redux";
import { accountSlice, setClientId, setState } from "./slices/account/account";
import { themeSlice } from "./slices/theme/theme";
import { notificationsSlice } from "./slices/notifications/notifications";
import { fetchClient } from "./slices/account/utils";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    theme: themeSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});
export type AppThunk<R, A extends Action = AnyAction> = ThunkAction<
  R,
  RootState,
  never,
  A
>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Load the client id.
fetchClient()
  .then((id) => {
    store.dispatch(setClientId(id));
    store.dispatch(setState("available"));
  })
  .catch(() => {
    store.dispatch(setState("failed"));
  });
