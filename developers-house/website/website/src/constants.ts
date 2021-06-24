import { DisplayDataApi } from "@developers-house/abdera";

const DisplayAPIClient = new DisplayDataApi();

const params: {
  [key: string]: string;
} = {};

const discordServer = "https://discord.com/invite/QECkmy8TqC";

const RequestParams = params;

export { RequestParams, DisplayAPIClient, discordServer };
