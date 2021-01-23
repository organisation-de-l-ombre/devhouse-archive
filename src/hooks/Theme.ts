import { useDispatch, useSelector } from "react-redux";
import { Action, GlobalState } from "../store/Types";
import { Theme } from "../store/theme/Types";
import changeTheme from "../store/theme/Actions";

const useTheme = (): { theme: Theme; switchTheme: () => Action } => {
  const dispatch = useDispatch();
  const theme: Theme = useSelector(
    (state: GlobalState): Theme => state.theme.theme
  );
  const switchTheme = () =>
    dispatch(changeTheme(theme === "light" ? "dark" : "light"));

  return { theme, switchTheme };
};

export default useTheme;
