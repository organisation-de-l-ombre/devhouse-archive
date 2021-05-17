import { FC } from "react";
import { MovieDataResponse } from "@developers-house/amelia";

export type ReactMovieElement = FC<{
  dataResponse: MovieDataResponse;
}>;
