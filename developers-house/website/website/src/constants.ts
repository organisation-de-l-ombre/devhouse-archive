import { Configuration, DisplayDataApi } from "@developers-house/abdera";
import { fetch as fetchPolyfill } from "cross-fetch";

const DisplayAPIClient = new DisplayDataApi(
  new Configuration({
    fetchApi: fetchPolyfill,
  })
);

const params: {
  [key: string]: string;
} = {};

const discordServer = "https://discord.com/invite/QECkmy8TqC";

const RequestParams = params;

export { RequestParams, DisplayAPIClient, discordServer };
