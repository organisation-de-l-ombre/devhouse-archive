import { MovieDataResponse } from "@developers-house/amelia";
import {
  CastingSection,
  GenericSection,
  OSTSection,
  TechnicalSpecsSection,
  VideosGlobalSection,
} from "@typings/movieTitle";

const MOVIE_TITLE_ADDED = "movieTitle/add";
const MOVIE_TITLE_SECTION_ADDED = "movieTitle/sectionAdded";

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
  movie?: GenericSection;
  casting?: CastingSection;
  characters?: GenericSection;
  videos?: VideosGlobalSection;
  ost?: OSTSection;
  "technical-specs"?: TechnicalSpecsSection;
}

type MovieTitleSuccess = MovieDataResponse & {
  rootStatus: "success";
  sections: MovieTitleSections;
};

type MovieTitle = MovieTitleLoading | MovieTitleError | MovieTitleSuccess;

interface MovieTitleState {
  [key: string]: MovieTitle;
}

interface RootAddPayload {
  type: typeof MOVIE_TITLE_ADDED;
  payload: MovieTitle;
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

interface SectionAddPayload {
  type: typeof MOVIE_TITLE_SECTION_ADDED;
  payload: MovieTitleSection;
}

type MovieTitlePayload = RootAddPayload | SectionAddPayload;

export {
  MOVIE_TITLE_ADDED,
  MOVIE_TITLE_SECTION_ADDED,
  MovieTitleSections,
  MovieTitleSuccess,
  MovieTitle,
  MovieTitleSection,
  MovieTitleSectionSuccess,
  MovieTitleState,
  MovieTitlePayload,
};
