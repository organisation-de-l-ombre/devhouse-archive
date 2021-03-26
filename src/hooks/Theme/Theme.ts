import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../../store/Types";
import { Theme } from "../../store/theme/Types";
import changeTheme from "../../store/theme/Actions";
import { ThemeHook } from "./Types";

const useTheme = (): ThemeHook => {
  const dispatch = useDispatch();
  const theme: Theme = useSelector(
    (state: GlobalState): Theme => state.theme.theme
  );
  const switchTheme = () =>
    dispatch(changeTheme(theme === "light" ? "dark" : "light"));

  return { theme, switchTheme };
};

export default useTheme;
