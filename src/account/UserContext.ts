import { createContext } from "react";
import { UserContext as UserContextType } from "./Types";

const UserContext = createContext<UserContextType>({
  user: null,
  loggedIn: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createUser: (response: unknown) => {},
  deleteUser: () => {},
});

export default UserContext;
