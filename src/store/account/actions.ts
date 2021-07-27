import { ApplicationAction } from "@store/types";
import { Tokens, User } from "./types";

const USER_CREATED = "account/userCreated";
const USER_DELETED = "account/userRemoved";
const USER_SET_TOKENS = "account/setTokens";

const createUser: ApplicationAction<"account/userCreated", [User]> = (
  payload: User
) => {
  return { type: USER_CREATED, payload };
};

const deleteUser: ApplicationAction<"account/userRemoved"> = () => {
  return { type: USER_DELETED, payload: null };
};

const setTokens: ApplicationAction<"account/setTokens", [Tokens]> = (
  tokens: Tokens
) => {
  console.log(tokens);
  return { type: USER_SET_TOKENS, payload: tokens };
};

export {
  createUser,
  deleteUser,
  setTokens,
  USER_CREATED,
  USER_DELETED,
  USER_SET_TOKENS,
};
export interface AccountActionsTypes {
  [USER_CREATED]: User;
  [USER_DELETED]: null;
  [USER_SET_TOKENS]: Tokens;
}
