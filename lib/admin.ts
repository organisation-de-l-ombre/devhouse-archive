import { AdminApi } from "@ory/hydra-client";
import axios from "axios";

const axiosClient = axios.create({ headers: { "X-Forwarded-Proto": "https" } });
export const Admin = new AdminApi(
  null,
  "http://hydra-admin.hydra:4445/",
  axiosClient as never
);
