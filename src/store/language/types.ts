type Language = string;

interface LanguagePayload {
  type: string;
  payload: Language;
}
interface LanguageReducerState {
  language: Language;
}

export { Language, LanguagePayload, LanguageReducerState };
