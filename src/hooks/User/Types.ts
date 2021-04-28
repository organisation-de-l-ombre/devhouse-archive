import { User, UserObject } from "../../store/user/Types";

export interface UserHook {
  user: User;
  saveUser: (payload: UserObject) => void;
  removeUser: () => void;
}
