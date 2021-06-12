import {
  LANGUAGE_UPDATED,
  LanguagePayload,
  LanguageReducerState,
  supportedLanguages,
} from "./types";

const detectLanguage = (): string => {
  const language = navigator.language.split("-")[0];

  if (!supportedLanguages.some((lang) => lang === language)) {
    return "en";
  }

  return language;
};

const languageState: LanguageReducerState = { language: detectLanguage() };

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

export { languageState, LanguageReducer };
