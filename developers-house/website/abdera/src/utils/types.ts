import {
  UserApi,
  WebauthApi,
  LoginApi,
  LinksApi
} from "@developers-house/scarlet";

export interface Scarlet {
  user: UserApi;
  webAuth: WebauthApi;
  login: LoginApi;
  links: LinksApi;
}
