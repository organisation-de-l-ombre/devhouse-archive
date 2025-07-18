import { MovieDataResponse } from "@developers-house/amelia";
import {
  CastingSection,
  GenericSection,
  OSTSection,
  TechnicalSpecsSection,
  VideosGlobalSection,
  WatchSection,
} from "@typings/movieTitle";

type Errors = "cors" | "internal" | "not-found" | "unauthorized" | "other";

interface MovieTitleLoading {
  id: string;
  rootStatus: "loading";
}

interface MovieTitleError {
  id: string;
  rootStatus: "error";
  error: Errors;
  statusCode?: number;
}

interface MovieTitleSections {
  watch?: MovieTitleSection<WatchSection>;
  movie?: MovieTitleSection<GenericSection>;
  casting?: MovieTitleSection<CastingSection>;
  characters?: MovieTitleSection<GenericSection>;
  videos?: MovieTitleSection<VideosGlobalSection>;
  ost?: MovieTitleSection<OSTSection>;
  "technical-specs"?: MovieTitleSection<TechnicalSpecsSection>;
}

type MovieTitleSuccess = MovieDataResponse & {
  rootStatus: "success";
  sections: MovieTitleSections;
  case?: string;
};

type MovieTitle = MovieTitleLoading | MovieTitleError | MovieTitleSuccess;

interface MovieTitleState {
  [key: string]: MovieTitle;
}

interface MovieTitleSectionLoading {
  id: string;
  sectionId: keyof MovieTitleSections;
  sectionStatus: "loading";
}

interface MovieTitleSectionError {
  id: string;
  sectionId: keyof MovieTitleSections;
  sectionStatus: "error";
  error: Errors;
  statusCode?: number;
}

type MovieTitleSectionSuccess<T> = {
  id: string;
  sectionId: keyof MovieTitleSections;
  sectionStatus: "success";
} & T;

type MovieTitleSection<T = unknown> =
  | MovieTitleSectionLoading
  | MovieTitleSectionError
  | MovieTitleSectionSuccess<T>;

export {
  MovieTitleSections,
  MovieTitleSuccess,
  MovieTitle,
  MovieTitleSection,
  MovieTitleSectionSuccess,
  MovieTitleState,
};
