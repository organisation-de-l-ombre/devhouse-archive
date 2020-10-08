export const UserInit = "USER_INIT";
export const UserTokenReceived = "USER_TOKEN_RECEIVED";
export const UserFetched = "USER_FETCHED";
export const UserLogout = "USER_LOGOUT";


type LinkedAccount = {
    id: string;
    user: User;
    providerColumn: string;
    providerName: string;
};

type Badge = {
    id: string;
    icon: string;
    name: string;
    rarity: number;
};

export type User = {
    id: string;
    accounts?: LinkedAccount[];
    badges?: Badge[];
    profilePicture?: string;
    publicAccount?: boolean;
    username: string;
};

export interface UserState {
    user?: User;
    token?: string;
    loggedIn: boolean;
}

interface UserInit {
    type: typeof UserInit;
}

interface UserTokenReceived {
    type: typeof UserTokenReceived;
    token: string;
}

interface UserFetched {
    type: typeof UserFetched;
    user: User;
}

interface UserLogout {
    type: typeof UserLogout;
}

export type PayloadTypes = UserInit | UserTokenReceived | UserFetched | UserLogout;

export const defaultState: UserState = {
    loggedIn: false
};

export default function reducer (
    state: UserState = defaultState,
    payload: PayloadTypes
): UserState {
    switch (payload.type) {
        case UserInit: {
            state = {
                ...state,
                loggedIn: false,
                token: undefined,
                user: undefined
            };
            break;
        }
        case UserTokenReceived: {
            state = {
                ...state,
                token: payload.token
            };
            break;
        }
        case UserFetched: {
            state = {
                ...state,
                user: payload.user,
                loggedIn: true
            };
            break;
        }
        case UserLogout: {
            state = {
                ...state,
                user: undefined,
                token: undefined,
                loggedIn: false
            };
            break;
        }
        default: break;
    }
    return state;
}
