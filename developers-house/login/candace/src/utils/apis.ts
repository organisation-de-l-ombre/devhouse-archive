import { AdminApi } from "@ory/hydra-client";
import { LoginApi, UserApi, WebauthApi } from "@developers-house/scarlet";

export const Admin = new AdminApi(
  {
    isJsonMime(mime: string): boolean {
      return mime === "application/json";
    },
    baseOptions: {
      headers: { "X-Forwarded-Proto": "https" }
    }
  },
  "http://hydra-1626807582-admin.hydra:4445"
);

const scarlet =
  "http://production.scarlet-22198115-production";
export const LoginAPI = new LoginApi(undefined, scarlet);
export const UserAPI = new UserApi(undefined, scarlet);
export const WebAuthAPI = new WebauthApi(undefined, scarlet);
