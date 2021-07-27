type User = {
  a2f: boolean;
  at_hash: string;
  aud: string[];
  auth_time: number;
  avatar: string;
  ban: string | null;
  created_at: Date;
  exp: number;
  iat: number;
  id: string;
  iss: string;
  jti: string;
  nonce: string;
  pub: boolean;
  rat: number;
  roles: number;
  sid: string;
  sub: string;
  updated_at: Date | null;
  username: string;
};

interface UserState {
  user: User | null;
  clientId: string | null;
  tokens: {
    refreshToken: string;
    accessToken: string;
    expire: Date;
  } | null;
}
export type Tokens = UserState["tokens"];
export { UserState, User };
