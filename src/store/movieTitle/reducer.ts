import { MovieTitlePayload, MovieTitleState, MOVIE_TITLE_ADDED } from "./types";

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

    default:
      return state;
  }
};

export default MovieTitleReducer;
