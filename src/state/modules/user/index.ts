export const UserInit = "USER_INIT";
export const UserTokenReceived = "USER_TOKEN_RECEIVED";
export const UserFetched = "USER_FETCHED";
export const UserLogout = "USER_LOGOUT";

export type User = {
  avatar: string;
  username: string;
  dataCollection: boolean;
  sub: string;
  private: boolean;
  premium: boolean;
};

export interface UserState {
  user?: User;
  token?: string;
  loggedIn: boolean;
}

interface TUserInit {
  type: typeof UserInit;
}

interface TUserTokenReceived {
  type: typeof UserTokenReceived;
  token: string;
}

interface TUserFetched {
  type: typeof UserFetched;
  user: User;
}

interface TUserLogout {
  type: typeof UserLogout;
}

export type PayloadTypes =
  | TUserInit
  | TUserTokenReceived
  | TUserFetched
  | TUserLogout;

export const defaultState: UserState = {
  loggedIn: false,
};

export default function reducer(
  state: UserState = defaultState,
  payload: PayloadTypes
): UserState {
  switch (payload.type) {
    case UserInit: {
      state = {
        ...state,
        loggedIn: false,
        token: undefined,
        user: undefined,
      };
      break;
    }
    case UserTokenReceived: {
      state = {
        ...state,
        token: payload.token,
      };
      break;
    }
    case UserFetched: {
      state = {
        ...state,
        user: payload.user,
        loggedIn: true,
      };
      break;
    }
    case UserLogout: {
      state = {
        ...state,
        user: undefined,
        token: undefined,
        loggedIn: false,
      };
      break;
    }
    default:
      break;
  }
  return state;
}
