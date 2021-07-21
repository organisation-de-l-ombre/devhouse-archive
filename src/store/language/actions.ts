import { Dispatch } from "redux";
import { LANGUAGE_UPDATED } from "@store/actions";
import { Language } from "./types";
import { Action } from "../types";

const updateLanguage = (language: Language): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: LANGUAGE_UPDATED, payload: language });
  };
};

export default updateLanguage;
