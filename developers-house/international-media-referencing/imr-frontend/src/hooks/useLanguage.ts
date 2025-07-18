import { Language } from "@store/language/types";
import { useSelector } from "react-redux";

const useLanguage = (): Language => {
  return useSelector(({ language }) => language.language);
};

export default useLanguage;
