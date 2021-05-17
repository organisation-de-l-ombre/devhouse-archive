import {
  MovieDataApi as MovieDataAPIBuilder,
  ContentSearchApi as SearchAPIBuilder,
  WikiApi as WikiAPIBuilder,
} from "@developers-house/amelia";

const MovieDataAPI = new MovieDataAPIBuilder();
const SearchAPI = new SearchAPIBuilder();
const WikiAPI = new WikiAPIBuilder();

export { DevHouseUserAPIInit as DevHouseUserAPI } from "../../IMRMain";
export { MovieDataAPI, SearchAPI, WikiAPI };
export { default as fetchOptions } from "./fetchOptions";
