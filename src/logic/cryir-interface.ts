import axios, { AxiosResponse } from "axios";
import { Takeout } from "../types/models/Takeout";

const CRYIR_ENDPOINT =
  process.env.CRYIR_ENDPOINT ||
  "http://production.cryir-23489597-production:5000";

function getUserTakeouts(user: string): Promise<AxiosResponse<Takeout[]>> {
  return axios.get<Takeout[]>(`${CRYIR_ENDPOINT}/takeouts/${user}`);
}

function postUserTakeout(user: string): Promise<Takeout> {
  return axios.put<never, Takeout>(`${CRYIR_ENDPOINT}/takeouts/${user}`);
}

export { postUserTakeout, getUserTakeouts };
