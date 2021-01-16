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
}

const USER_CREATED = "USER_CREATED";
const USER_DELETED = "USER_DELETED";

export { UserObject, User, UserPayload, UserState, USER_CREATED, USER_DELETED };
