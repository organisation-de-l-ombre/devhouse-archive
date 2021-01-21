import { Dispatch } from "redux";
import { Action } from "../Types";
import { Language, LANGUAGE_UPDATED } from "./Types";

const updateLanguage = (language: Language): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: LANGUAGE_UPDATED, payload: language });
  };
};

export default updateLanguage;
