import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { GlobalState } from "@store/types";
import { deleteUser } from "@store/account/actions";
import { User } from "@store/account/types";

interface UseAccountManagerHook {
  removeUser: () => void;
}

const useAccount = (): User | null => {
  return useSelector((state: GlobalState) => state.account.user);
};

const useAccountManager = (): UseAccountManagerHook => {
  const dispatch = useDispatch();
  const removeUser = useCallback(() => dispatch(deleteUser()), [dispatch]);

  return { removeUser };
};

export { useAccount, useAccountManager };
