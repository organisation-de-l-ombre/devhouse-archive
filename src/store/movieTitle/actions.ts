import { MOVIE_TITLE_ADDED, MOVIE_TITLE_SECTION_ADDED } from "@store/actions";
import { Action } from "@store/types";
import { Dispatch } from "redux";
import { MovieTitle, MovieTitleSection } from "./types";

const addMovieTitle = (payload: MovieTitle): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: MOVIE_TITLE_ADDED, payload });
  };
};

const addMovieTitleSection = (payload: MovieTitleSection): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({
      type: MOVIE_TITLE_SECTION_ADDED,
      payload,
    });
  };
};

export { addMovieTitle, addMovieTitleSection };
