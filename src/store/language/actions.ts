import { ApplicationAction } from "@store/types";
import { Language } from "./types";

const LANGUAGE_UPDATED = "language/languageUpdated";

const updateLanguage: ApplicationAction<
  "language/languageUpdated",
  [Language]
> = (language: Language) => {
  return { type: LANGUAGE_UPDATED, payload: language };
};

export { updateLanguage, LANGUAGE_UPDATED };
export interface LanguageActionTypes {
  [LANGUAGE_UPDATED]: Language;
}
