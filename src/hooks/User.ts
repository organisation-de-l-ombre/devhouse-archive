import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { User, UserObject } from "../store/user/Types";
import { Action, GlobalState } from "../store/Types";
import { createUser, deleteUser } from "../store/user/Actions";
import { manageAuth } from "../store/user/Login";

const useUser = (): {
  user: User;
  manageUser: () => Promise<void>;
  saveUser: (payload: UserObject) => Action;
  removeUser: () => void;
} => {
  const dispatch = useDispatch();
  const history = useHistory();
  const user: User = useSelector((state: GlobalState): User => state.user.user);
  const manageUser = async (): Promise<void> => {
    if (user) {
      history.push("/account");
    } else {
      await manageAuth();
    }
  };
  const saveUser = (payload: UserObject) => dispatch(createUser(payload));
  const removeUser = () => {
    dispatch(deleteUser());
  };

  return { user, manageUser, saveUser, removeUser };
};

export default useUser;
