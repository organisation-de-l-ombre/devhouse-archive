import { GraphQLClient } from "graphql-request";
import { DisplayDataApi } from "./api/gen";

const GRAPHQL_ENDPOINT = "https://abdera-gateway.developershouse.xyz";
const GlobalGraphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);
const DisplayAPIClient = new DisplayDataApi();

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

const RequestParams = params;

export {
  GRAPHQL_ENDPOINT,
  GlobalGraphQLClient,
  RequestParams,
  DisplayAPIClient,
};
