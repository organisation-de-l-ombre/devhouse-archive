import { SelfUser } from "@developers-house/abdera";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../redux";
import { login } from "./actions";

const selectors = {
  currentUser: (state: RootState) => state.account.user,
  hasUser: (state: RootState) => !!state.account.user,
  available: (state: RootState) => state.account.state === "available",
  clientId: (state: RootState) => state.account.client_id,
};

export const useUser = (): (SelfUser & { token: string }) | undefined =>
  useAppSelector(selectors.currentUser);
export const useLogin = () => {
  const available = useAppSelector(selectors.available);
  const dispatch = useDispatch();
  const user = useUser();
  const doLogin = useCallback(() => dispatch(login()), [dispatch]);
  return {
    available,
    login: doLogin,
    user,
  };
};
export const useClientId = (): string | undefined =>
  useAppSelector(selectors.clientId);
export const useHasUser = (): boolean => useAppSelector(selectors.hasUser);
