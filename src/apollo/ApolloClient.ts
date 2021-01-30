import { ApolloClient, InMemoryCache } from "@apollo/client";
import { RestLink } from "apollo-link-rest";

const restLink = new RestLink({
  endpoints: {
    "api/devhouse": "https://22309686-review-graphql-6mhtvp.matthieu-dev.xyz/",
  },
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

export default client;
