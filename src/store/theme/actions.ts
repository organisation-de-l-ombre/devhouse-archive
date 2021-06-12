import { Dispatch } from "redux";
import { Action } from "../types";
import { Theme, THEME_CONTRAST_UPDATED, THEME_UPDATED } from "./types";

const updateTheme = (theme: Theme): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: THEME_UPDATED, payload: theme });
  };
};

const updateContrastMode = (contrast: boolean): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: THEME_CONTRAST_UPDATED, payload: contrast });
  };
};

export { updateTheme, updateContrastMode };
