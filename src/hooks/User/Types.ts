import { User, UserObject } from "../../store/user/Types";

export interface UserHook {
  user: User;
  manageUser: () => Promise<void>;
  saveUser: (payload: UserObject) => void;
  removeUser: () => void;
}
