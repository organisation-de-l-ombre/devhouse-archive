interface UserContext {
  user: User | null;
  loggedIn: boolean;
  createUser: (response: unknown) => void;
  deleteUser: () => void;
}

interface User {
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

export { UserContext, User };
