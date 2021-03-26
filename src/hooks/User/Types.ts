import { User, UserObject } from "../../store/user/Types";
import { Action } from "../../store/Types";

export interface UserHook {
  user: User;
  manageUser: () => Promise<void>;
  saveUser: (payload: UserObject) => Action;
  removeUser: () => Action;
}
