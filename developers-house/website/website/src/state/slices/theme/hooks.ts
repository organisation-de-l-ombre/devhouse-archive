import { useAppSelector } from "../../hooks";
import { RootState } from "../../redux";
import { ThemeState } from "./theme";

const selectors = {
  currentTheme: (state: RootState) => state.theme.theme,
};

export const useTheme = (): ThemeState["theme"] =>
  useAppSelector(selectors.currentTheme);
