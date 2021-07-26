interface UserObject {
  avatar: string;
  dataCollection: boolean;
  premium: boolean;
  private: boolean;
  roles: number;
  sid: string;
  sub: string;
  username: string;
  token: string;
}

type User = UserObject | undefined;

interface UserPayload {
  type: string;
  payload: UserObject;
}

interface UserState {
  user: User;
  clientId?: string;
}

export { UserObject, User, UserPayload, UserState };
