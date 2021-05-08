export type GeneralUser = {
  id: string;
  username: string;
  provider: string;
  avatarURL: string;
};

export interface Provider {
  getUserData(token: string): Promise<GeneralUser>;
  exchangeCode(code: string, host: string): Promise<string>;
  getRedirectUri(state: string, host: string): string;
  meta(): { name: string; color: string };
}

export type ConstructorType = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
};
