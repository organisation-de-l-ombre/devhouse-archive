import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { GlobalState } from "@store/Types";
import { User, UserObject } from "../../store/user/Types";
import { createUser, deleteUser } from "../../store/user/Actions";
import { UserHook } from "./Types";

const useUser = (): UserHook => {
  const dispatch = useDispatch();
  const user: User = useSelector((state: GlobalState): User => state.user.user);

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

export default useUser;
