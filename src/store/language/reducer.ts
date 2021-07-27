import { ApplicationReducer } from "@store/types";
import { LANGUAGE_UPDATED } from "./actions";
import { LanguageReducerState } from "./types";

const defaultLanguageState: LanguageReducerState = { language: "" };
const LanguageReducer: ApplicationReducer<"language"> = (
  state: LanguageReducerState = defaultLanguageState,
  payload
) => {
  switch (payload.type) {
    case LANGUAGE_UPDATED:
      return { ...state, language: payload.payload };

    default:
      return state;
  }
};

export default LanguageReducer;
