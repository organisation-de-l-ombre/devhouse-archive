import { configureStore, DeepPartial, Store } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { Action, AnyAction } from "redux";
import { accountSlice, UserState } from "./slices/account/account";
import { themeSlice, ThemeState } from "./slices/theme/theme";
import {
  notificationsSlice,
  NotificationsState,
} from "./slices/notifications/notifications";
import {
  featureFlagSlice,
  FeatureFlagState,
} from "./slices/featureFlags/featureFlag";

export type AppThunk<R, A extends Action = AnyAction> = ThunkAction<
  R,
  RootState,
  never,
  A
>;
type TypedStore = Store<{
  account: UserState;
  theme: ThemeState;
  notifications: NotificationsState;
  featureFlags: FeatureFlagState;
}>;

const createStore = (preloaded: DeepPartial<RootState>): TypedStore => {
  return configureStore({
    reducer: {
      account: accountSlice.reducer,
      theme: themeSlice.reducer,
      notifications: notificationsSlice.reducer,
      featureFlags: featureFlagSlice.reducer,
    },
    preloadedState: preloaded as RootState,
  });
};
export default createStore;
export type RootState = ReturnType<TypedStore["getState"]>;
export type AppDispatch = TypedStore["dispatch"];
