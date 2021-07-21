import { USER_CREATED, USER_DELETED } from "@store/actions";
import { UserPayload, UserState } from "./types";

const accountState: UserState = { user: undefined };

const AccountReducer = (
  state: UserState = accountState,
  { type, payload: user }: UserPayload
): UserState => {
  switch (type) {
    case USER_CREATED:
      return { ...state, user };

    case USER_DELETED:
      return { ...state, user: undefined };

    default:
      return state;
  }
};

export default AccountReducer;
