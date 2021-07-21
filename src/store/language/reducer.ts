import { LANGUAGE_UPDATED } from "@store/actions";
import { LanguagePayload, LanguageReducerState } from "./types";

const languageState: LanguageReducerState = { language: "" };

const LanguageReducer = (
  state: LanguageReducerState = languageState,
  { type, payload: language }: LanguagePayload
): LanguageReducerState => {
  switch (type) {
    case LANGUAGE_UPDATED:
      return { ...state, language };

    default:
      return state;
  }
};

export default LanguageReducer;
