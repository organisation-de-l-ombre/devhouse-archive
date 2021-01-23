type Language = string;

interface LanguagePayload {
  type: string;
  payload: Language;
}
interface LanguageState {
  language: Language;
}

const LANGUAGE_UPDATED = "LANGUAGE_UPDATED";
const supportedLanguages = ["en", "fr", "de"];

export {
  Language,
  LanguagePayload,
  LanguageState,
  LANGUAGE_UPDATED,
  supportedLanguages,
};
