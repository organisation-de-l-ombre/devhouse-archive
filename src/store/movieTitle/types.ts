import { MovieDataResponse } from "@developers-house/amelia";
import {
  CastingSection,
  GenericSection,
  OSTSection,
  TechnicalSpecsSection,
  VideosGlobalSection,
} from "@typings/movieTitle";

// type Status = "loading" | "error" | "success";

interface MovieTitleSections {
  movie?: GenericSection;
  casting?: CastingSection;
  characters?: GenericSection;
  videos?: VideosGlobalSection;
  ost?: OSTSection;
  technical_specs?: TechnicalSpecsSection;
}

interface MovieTitleLoading {
  id: string;
  rootStatus: "loading";
}

interface MovieTitleError {
  id: string;
  rootStatus: "error";
  error: "cors" | "internal" | "not-found" | "unauthorized" | "other";
  statusCode?: number;
}

type MovieTitleSuccess = MovieDataResponse & {
  rootStatus: "success";
  sections: MovieTitleSections;
};

type MovieTitle = MovieTitleLoading | MovieTitleError | MovieTitleSuccess;

interface MovieTitleState {
  [key: string]: MovieTitle;
}

const MOVIE_TITLE_ADDED = "@movieTitle/add";
const MOVIE_TITLE_SECTION_LOADED = "@movieTitle/sectionLoadingUpdated";
const MOVIE_TITLE_SECTION_ADDED = "@movieTitle/sectionAdded";

interface RootAddPayload {
  type: typeof MOVIE_TITLE_ADDED;
  payload: MovieTitle;
}

interface SectionLoadingPayload {
  type: typeof MOVIE_TITLE_SECTION_LOADED;
  payload: {
    movieId: string;
    loading: boolean;
  };
}

type SectionData =
  | GenericSection
  | CastingSection
  | VideosGlobalSection
  | OSTSection
  | TechnicalSpecsSection;

interface SectionAddPayload {
  type: typeof MOVIE_TITLE_SECTION_ADDED;
  payload: {
    movieId: string;
    section: keyof MovieTitleSections;
    data: SectionData;
  };
}

type MovieTitlePayload =
  | RootAddPayload
  | SectionLoadingPayload
  | SectionAddPayload;

export {
  MovieTitleSections,
  MovieTitleSuccess,
  MovieTitle,
  MovieTitleState,
  MOVIE_TITLE_ADDED,
  MOVIE_TITLE_SECTION_LOADED,
  MOVIE_TITLE_SECTION_ADDED,
  SectionData,
  MovieTitlePayload,
};
