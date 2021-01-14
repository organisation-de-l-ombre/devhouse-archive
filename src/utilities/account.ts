/*
 * This file represents all the calls to the api.
 */

import { User } from "../state/modules/user";

const fetchUser = (token: string): Promise<User> => {
  return fetch("https://auth-server.developershouse.xyz/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((x) => x.json());
};

export { fetchUser };
