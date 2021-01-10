import { GraphQLClient } from "graphql-request";

export const GRAPHQL_ENDPOINT =
  "https://22309686-review-graphql-6mhtvp.matthieu-dev.xyz/";

export const GlobalGraphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);

const params: {
  [key: string]: string;
} = {};

const doSearch = (hash: string) => {
  hash.split("&").forEach((hk) => {
    const temp = hk.split("=");
    const [name, value] = temp;
    params[name] = value;
  });
};

doSearch(window.location.hash.substring(1) || "");
doSearch(window.location.href.split("?")[1] || "");

export const RequestParams = params;
