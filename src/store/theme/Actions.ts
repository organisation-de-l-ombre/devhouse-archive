import { Dispatch } from "redux";
import { Action } from "../Types";
import { THEME_UPDATED } from "./Types";

const updateTheme = (theme: "light" | "dark"): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: THEME_UPDATED, payload: theme });
  };
};

export default updateTheme;
