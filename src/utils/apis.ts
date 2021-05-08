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
  "http://hydra-admin.hydra:4445"
);

const scarlet =
  "http://review-v2-openapi-2nrasx.scarlet-22198115-review-v2-openapi-2nrasx";
export const LoginAPI = new LoginApi(undefined, scarlet);
export const UserAPI = new UserApi(undefined, scarlet);
export const WebAuthAPI = new WebauthApi(undefined, scarlet);
