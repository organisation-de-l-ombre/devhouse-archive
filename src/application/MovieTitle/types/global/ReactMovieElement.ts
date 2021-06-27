import { MovieDataResponse } from "@developers-house/amelia";
import { FunctionComponent } from "@typings/FunctionComponent";

export type ReactMovieElement = FunctionComponent<
  HTMLDivElement,
  { dataResponse: MovieDataResponse }
>;
