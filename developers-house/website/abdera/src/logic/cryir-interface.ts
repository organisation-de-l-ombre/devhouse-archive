import { Takeout } from "../../gen";
import axios from "axios";

const CRYIR_ENDPOINT =
  process.env.CRYIR_ENDPOINT ||
  "http://production.cryir-23489597-production:5000";

async function getUserTakeouts(user: string): Promise<Takeout[]> {
  const takeout = await axios.get<Takeout[]>(
    `${CRYIR_ENDPOINT}/requests/user/${user}`
  );
  return takeout.data;
}

async function postUserTakeout(user: string): Promise<Takeout> {
  return await axios.post<never, Takeout>(
    `${CRYIR_ENDPOINT}/requests?userId=${user}`
  );
}

export { postUserTakeout, getUserTakeouts };
