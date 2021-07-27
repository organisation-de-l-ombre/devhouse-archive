import { ApplicationReducer } from "@store/types";
import { USER_CREATED, USER_DELETED, USER_SET_TOKENS } from "./actions";
import { UserState } from "./types";

const defaultAccountState: UserState = {
  user: null,
  clientId: null,
  tokens: null,
};

const AccountReducer: ApplicationReducer<"account"> = (
  state = defaultAccountState,
  payload
) => {
  switch (payload.type) {
    case USER_SET_TOKENS:
      return { ...state, tokens: payload.payload };
    case USER_CREATED:
      return { ...state, user: payload.payload };
    case USER_DELETED:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default AccountReducer;
