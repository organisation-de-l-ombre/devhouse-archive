import { UserAPIApi } from "@developers-house/abdera";
import { AppThunk } from "../../redux";
import { retrieveOauthToken } from "./utils";
import { setState, setUser } from "./account";

export function login(): AppThunk<void> {
  return async (dispatch, getState) => {
    dispatch(setState("loading"));
    const state = getState();
    if (!state.account.client_id) return;
    try {
      const token = await retrieveOauthToken(state.account.client_id);
      const user = await new UserAPIApi()
        .withPreMiddleware(async (c) => {
          c.init.headers = {
            Authorization: `Bearer ${token}`,
          };
          // TODO: Remove this line to call abdera when implemented.
          c.url = "https://auth-server.developershouse.xyz/userinfo";
          return c;
        })
        .selfGet();
      dispatch(setUser({ ...user, token }));
      dispatch(setState("available"));
    } catch (e) {
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
