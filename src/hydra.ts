import { AdminApi } from "@ory/hydra-client";
import axios, { AxiosResponse } from "axios";

const requester = axios.create({
  headers: {
    "X-Forwarded-Proto": "https"
  }
});

export const AdminAPI = new AdminApi(
  undefined,
  process.env.HYDRA_ADMIN || "http://localhost:5005",
  requester as never
);

export function validateHydraResponse<T>(response: AxiosResponse<T>): T {
  if (response.status < 200 || response.status > 299) {
    throw new Error("Failed to request hydra.");
  }
  return response.data;
}
