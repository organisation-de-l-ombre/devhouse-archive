import { MovieTitleSuccess } from "@store/movieTitle/types";
import { FunctionComponent } from "@typings/FunctionComponent";

export type MovieTitleComponent = FunctionComponent<
  HTMLDivElement,
  { dataResponse: MovieTitleSuccess }
>;
