import { Dispatch } from "redux";
import { THEME_CONTRAST_UPDATED, THEME_UPDATED } from "@store/actions";
import { Action } from "../types";
import { Theme } from "./types";

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
