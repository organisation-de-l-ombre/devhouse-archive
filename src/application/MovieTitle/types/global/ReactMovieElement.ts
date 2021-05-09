import { FC } from "react";
import { RootResponse } from "./RootResponse";

export type ReactMovieElement = FC<{
  dataResponse: RootResponse;
}>;
