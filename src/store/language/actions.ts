import { Dispatch } from "redux";
import { Action } from "../types";
import { Language, LANGUAGE_UPDATED } from "./types";

const updateLanguage = (language: Language): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: LANGUAGE_UPDATED, payload: language });
  };
};

export default updateLanguage;
