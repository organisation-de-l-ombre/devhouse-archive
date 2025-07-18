import { ApplicationReducer } from "@store/types";
import { MOVIE_TITLE_ADDED, MOVIE_TITLE_SECTION_ADDED } from "./actions";
import { MovieTitle } from "./types";

const MovieTitleReducer: ApplicationReducer<"movieTitle"> = (
  state = {},
  payload
) => {
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
