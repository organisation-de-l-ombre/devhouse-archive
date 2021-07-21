import { MOVIE_TITLE_ADDED, MOVIE_TITLE_SECTION_ADDED } from "@store/actions";
import { MovieTitle, MovieTitlePayload, MovieTitleState } from "./types";

const movieTitleState: MovieTitleState = {};

const MovieTitleReducer = (
  state: MovieTitleState = movieTitleState,
  payload: MovieTitlePayload
): MovieTitleState => {
  switch (payload.type) {
    case MOVIE_TITLE_ADDED: {
      return {
        ...state,
        [payload.payload.id]: payload.payload,
      };
    }

    case MOVIE_TITLE_SECTION_ADDED: {
      const movieTitle: MovieTitle | undefined = state[payload.payload.id];

      if (!movieTitle || (movieTitle && movieTitle.rootStatus !== "success")) {
        return state;
      }

      return {
        ...state,
        [payload.payload.id]: {
          ...movieTitle,
          sections: {
            ...movieTitle.sections,
            [payload.payload.sectionId]: {
              ...movieTitle.sections[payload.payload.sectionId],
              ...payload.payload,
            },
          },
        },
      };
    }

    default:
      return state;
  }
};

export default MovieTitleReducer;
