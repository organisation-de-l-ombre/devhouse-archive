import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { GlobalState } from "@store/types";
import { Theme, ThemeState } from "@store/theme/types";
import { updateContrastMode, updateTheme } from "@store/theme/actions";
import themes from "@styles/Themes.module.scss";

interface ThemeHook {
  theme: Theme;
  contrastMode: boolean;
  toggleContrastMode: () => void;
  switchTheme: () => void;
}

const useTheme = (): ThemeHook => {
  const dispatch = useDispatch();
  const { theme, contrastMode } = useSelector(
    (state: GlobalState): ThemeState => state.theme
  );

  const toggleContrastMode = useCallback((): void => {
    dispatch(updateContrastMode(!contrastMode));
  }, [contrastMode, dispatch]);

  const switchTheme = useCallback((): void => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";

    if (contrastMode && !themes[`${newTheme}-contrast`]) {
      toggleContrastMode();
    }

    dispatch(updateTheme(newTheme));
  }, [contrastMode, dispatch, theme, toggleContrastMode]);

  return { theme, contrastMode, toggleContrastMode, switchTheme };
};

export default useTheme;
