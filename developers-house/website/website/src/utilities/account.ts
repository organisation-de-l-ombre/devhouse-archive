/*
 * This file represents all the calls to the api.
 */

import axios from "axios";
import { User } from "../state/modules/user";

const fetchUser = async (): Promise<User> => {
  const { data } = await axios.get<User>(
    "https://auth-server.developershouse.xyz/userinfo"
  );
  return data;
};

export { fetchUser };
