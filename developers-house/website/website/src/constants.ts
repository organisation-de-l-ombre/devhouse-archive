import { Configuration, DisplayDataApi } from "@developers-house/abdera";
import { fetch as fetchPolyfill } from "cross-fetch";

const DisplayAPIClient = new DisplayDataApi(
  new Configuration({
    fetchApi: fetchPolyfill,
  })
);

const discordServer = "https://discord.com/invite/QECkmy8TqC";

export { DisplayAPIClient, discordServer };
