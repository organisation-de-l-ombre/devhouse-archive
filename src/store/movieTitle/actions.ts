import { Action } from "@store/types";
import { Dispatch } from "redux";
import {
  MovieTitle,
  MovieTitleSections,
  MOVIE_TITLE_ADDED,
  MOVIE_TITLE_SECTION_ADDED,
  MOVIE_TITLE_SECTION_LOADED,
  SectionData,
} from "./types";

const addMovieTitle = (payload: MovieTitle): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: MOVIE_TITLE_ADDED, payload });
  };
};

const updateMovieTitleSectionLoading = (
  movieId: string,
  loading: boolean
): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({
      type: MOVIE_TITLE_SECTION_LOADED,
      payload: {
        movieId,
        loading,
      },
    });
  };
};

const addMovieTitleSection = (
  movieId: string,
  section: keyof MovieTitleSections,
  payload: SectionData
): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({
      type: MOVIE_TITLE_SECTION_ADDED,
      payload: { movieId, section, data: payload },
    });
  };
};

export { addMovieTitle, updateMovieTitleSectionLoading, addMovieTitleSection };
