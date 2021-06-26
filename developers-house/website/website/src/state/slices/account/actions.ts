import { Configuration, UserAPIApi } from "@developers-house/abdera";
import { AppThunk } from "../../redux";
import { retrieveOauthToken } from "./utils";
import { setState, setUser } from "./account";
import { addNotification } from "../notifications/notifications";

export function login(): AppThunk<void> {
  return async (dispatch, getState) => {
    dispatch(setState("loading"));
    const state = getState();
    if (!state.account.client_id) return;
    try {
      const token = await retrieveOauthToken(state.account.client_id);
      const user = await new UserAPIApi(
        new Configuration({
          middleware: [
            {
              async pre(context) {
                context.init.headers = {
                  ...context.init.headers,
                  Authorization: `Bearer ${token}`,
                };
                return context;
              },
            },
          ],
        })
      ).selfGet();
      dispatch(setUser({ ...user, token }));
      dispatch(setState("available"));
      dispatch(
        addNotification({
          level: "information",
          text: `Welcome ${user.username}!`,
          time: 5000,
        })
      );
    } catch (e) {
      dispatch(
        addNotification({
          level: "error",
          text: `Failed to login using the popup method ${e.message}`,
          time: 3000,
        })
      );
      dispatch(setState("available"));
    }
  };
}

export function logout(): AppThunk<void> {
  return async (dispatch) => {
    dispatch(setState("available"));
    dispatch(setUser());
  };
}
