import { USER_CREATED, USER_DELETED, UserPayload, UserState } from "./Types";

const userState: UserState = { user: undefined };
const storage = localStorage.getItem("user");

if (storage) {
  userState.user = JSON.parse(storage);
}

const useReducer = (
  state: UserState = userState,
  { type, payload: user }: UserPayload
): UserState => {
  switch (type) {
    case USER_CREATED: {
      localStorage.setItem("user", JSON.stringify(user));
      return { ...state, user };
    }

    case USER_DELETED: {
      localStorage.removeItem("user");
      return { ...state, user: undefined };
    }

    default:
      return state;
  }
};

export default useReducer;
