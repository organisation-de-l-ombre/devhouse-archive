import { Dispatch, SetStateAction } from "react";

export interface LanguageHook {
  language: string;
  setLanguageState: Dispatch<SetStateAction<string>>;
  validateLanguage: (
    setLanguageWindowOpen: Dispatch<SetStateAction<boolean>>
  ) => Promise<void>;
}
