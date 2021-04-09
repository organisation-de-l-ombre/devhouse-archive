import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useCallback } from "react";
import { User, UserObject } from "../../store/user/Types";
import { GlobalState } from "../../store/Types";
import { createUser, deleteUser } from "../../store/user/Actions";
import { manageAuth } from "../../store/user/Login";
import { UserHook } from "./Types";

const useUser = (): UserHook => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user: User = useSelector((state: GlobalState): User => state.user.user);

  const manageUser = useCallback(async (): Promise<void> => {
    if (user) {
      history.push("/account");
    } else {
      await manageAuth();
    }
  }, [history, user]);
  const saveUser = useCallback(
    (payload: UserObject): void => {
      dispatch(createUser(payload));
    },
    [dispatch]
  );
  const removeUser = useCallback((): void => {
    dispatch(deleteUser());
  }, [dispatch]);

  return { user, manageUser, saveUser, removeUser };
};

export default useUser;
