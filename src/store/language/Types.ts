type Language = string;

interface LanguagePayload {
  type: string;
  payload: Language;
}
interface LanguageReducerState {
  language: Language;
}

const LANGUAGE_UPDATED = "LANGUAGE_UPDATED";
const supportedLanguages = ["en", "fr"];

export {
  Language,
  LanguagePayload,
  LanguageReducerState,
  LANGUAGE_UPDATED,
  supportedLanguages,
};
