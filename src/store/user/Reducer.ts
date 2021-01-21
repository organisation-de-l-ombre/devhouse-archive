import { USER_CREATED, USER_DELETED, UserPayload, UserState } from "./Types";

const userState: UserState = { user: undefined };
const userReducer = (
  state: UserState = userState,
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

export default userReducer;
export { userState };
