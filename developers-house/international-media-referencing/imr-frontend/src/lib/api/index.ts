import { UserAPIApi } from "@developers-house/abdera";
import {
  MovieDataApi as MovieDataAPIBuilder,
  ContentSearchApi as SearchAPIBuilder,
  WikiApi as WikiAPIBuilder,
} from "@developers-house/amelia";

const MovieDataAPI = new MovieDataAPIBuilder();
const SearchAPI = new SearchAPIBuilder();
const WikiAPI = new WikiAPIBuilder();
const DevHouseUserAPI = new UserAPIApi();

// export { DevHouseUserAPIInit as DevHouseUserAPI } from "../..";
export { default as fetchOptions } from "./fetchOptions";
export { MovieDataAPI, SearchAPI, WikiAPI, DevHouseUserAPI };
