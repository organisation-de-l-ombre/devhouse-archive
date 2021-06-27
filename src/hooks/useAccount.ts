import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { GlobalState } from "@store/types";
import { User, UserObject } from "@store/account/types";
import { createUser, deleteUser } from "@store/account/actions";

interface UserHook {
  user: User;
  saveUser: (payload: UserObject) => void;
  removeUser: () => void;
}

const useAccount = (): UserHook => {
  const dispatch = useDispatch();

  const user: User = useSelector(
    (state: GlobalState): User => state.account.user
  );

  const saveUser = useCallback(
    (payload: UserObject): void => {
      dispatch(createUser(payload));
    },
    [dispatch]
  );

  const removeUser = useCallback((): void => {
    dispatch(deleteUser());
  }, [dispatch]);

  return { user, saveUser, removeUser };
};

export default useAccount;
