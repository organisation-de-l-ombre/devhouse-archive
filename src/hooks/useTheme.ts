import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { GlobalState } from "@store/types";
import { Theme, ThemeState } from "@store/theme/types";
import { updateContrastMode, updateTheme } from "@store/theme/actions";

interface ThemeHook {
  theme: Theme;
  contrastMode: boolean;
  switchTheme: () => void;
  toggleContrastMode: () => void;
}

const useTheme = (): ThemeHook => {
  const dispatch = useDispatch();
  const { theme, contrastMode } = useSelector(
    (state: GlobalState): ThemeState => state.theme
  );

  const switchTheme = useCallback((): void => {
    dispatch(updateTheme(theme === "light" ? "dark" : "light"));
  }, [dispatch, theme]);

  const toggleContrastMode = useCallback((): void => {
    dispatch(updateContrastMode(!contrastMode));
  }, [contrastMode, dispatch]);

  return { theme, contrastMode, switchTheme, toggleContrastMode };
};

export default useTheme;
