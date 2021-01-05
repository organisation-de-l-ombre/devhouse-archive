import { GraphQLClient } from "graphql-request";

export const GRAPHQL_ENDPOINT =
  "https://22309686-review-graphql-6mhtvp.matthieu-dev.xyz/";

export const GlobalGraphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT);
