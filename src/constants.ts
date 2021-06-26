import { Configuration, DisplayDataApi } from "@developers-house/abdera";
import { getAbderaEndpoint } from "@utilities/endpoints";
import { fetch as fetchPolyfill } from "cross-fetch";

const DisplayAPIClient = new DisplayDataApi(
  new Configuration({
    fetchApi: fetchPolyfill,
    basePath: getAbderaEndpoint(),
  })
);

const discordServer = "https://discord.com/invite/QECkmy8TqC";

export { DisplayAPIClient, discordServer };
