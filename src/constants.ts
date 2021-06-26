import { Configuration, DisplayDataApi } from "@developers-house/abdera";
import { RootState } from "@state/redux";
import { getAbderaEndpoint } from "@utilities/endpoints";
import { fetch as fetchPolyfill } from "cross-fetch";

export const persistedStoreKeys = [
  "theme",
  "account",
] as never as (keyof RootState)[];

const DisplayAPIClient = new DisplayDataApi(
  new Configuration({
    fetchApi: fetchPolyfill,
    basePath: getAbderaEndpoint(),
  })
);

const discordServer = "https://discord.com/invite/QECkmy8TqC";

export { DisplayAPIClient, discordServer };
