import { MovieDataResponse } from "@developers-house/amelia";
import { MovieDataAPI } from "@lib/api";
import { ApplicationAction } from "@store/types";
import { ReduxActions } from "@store/actions";
import axios, { AxiosResponse } from "axios";
import { Language } from "@store/language/types";
import { Section } from "@typings/movieTitle";
import { MovieTitle, MovieTitleSection, MovieTitleSections } from "./types";

const MOVIE_TITLE_ADDED = "movieTitle/add";
const MOVIE_TITLE_SECTION_ADDED = "movieTitle/sectionAdded";

const addMovieTitle: ApplicationAction<"movieTitle/add", [string, Language]> = (
  movieId: string,
  language: Language
) => {
  return async (dispatch) => {
    // We set the status of the movie to loading.
    dispatch({
      type: MOVIE_TITLE_ADDED,
      payload: {
        id: movieId,
        rootStatus: "loading",
      },
    });
    try {
      const { data, status }: AxiosResponse<MovieDataResponse> =
        await MovieDataAPI.getMovieData(movieId, language);

      if (!data) {
        const errorData: ReduxActions["movieTitle/add"] = {
          id: movieId,
          rootStatus: "error",
          error: "other",
          statusCode: status,
        };
        switch (status) {
          case 503:
            errorData.error = "internal";
            break;
          case 404:
            errorData.error = "not-found";
            break;
          case 401:
            errorData.error = "unauthorized";
            break;
        }
        dispatch({ type: MOVIE_TITLE_ADDED, payload: errorData });
        return;
      }

      dispatch({
        type: MOVIE_TITLE_ADDED,
        payload: {
          ...data,
          rootStatus: "success",
          sections: {},
        },
      });
    } catch (e) {
      dispatch({
        type: MOVIE_TITLE_ADDED,
        payload: {
          id: movieId,
          rootStatus: "error",
          error: "cors",
        },
      });
    }
  };
};

const addMovieTitleSection: ApplicationAction<
  "movieTitle/sectionAdded",
  [string, keyof MovieTitleSections]
> = (movieId, sectionId) => {
  return async (dispatch, getState) => {
    dispatch({
      type: MOVIE_TITLE_SECTION_ADDED,
      payload: {
        sectionStatus: "loading",
        sectionId,
        id: movieId,
      },
    });
    const { movieTitle } = getState();
    const title = movieTitle[movieId];
    if (
      title &&
      title.rootStatus === "success" &&
      title.data[sectionId as never]
    ) {
      try {
        const { data, status }: AxiosResponse<Section> = await axios.get(
          title.data[sectionId as never]
        );

        if (!data) {
          const errorData: ReduxActions["movieTitle/sectionAdded"] = {
            id: movieId,
            sectionStatus: "error",
            error: "other",
            statusCode: status,
            sectionId,
          };
          switch (status) {
            case 503:
              errorData.error = "internal";
              break;
            case 404:
              errorData.error = "not-found";
              break;
            case 401:
              errorData.error = "unauthorized";
              break;
          }
          dispatch({ type: MOVIE_TITLE_SECTION_ADDED, payload: errorData });
          return;
        }
        dispatch({
          type: MOVIE_TITLE_SECTION_ADDED,
          payload: {
            ...data,
            id: movieId,
            sectionId,
            sectionStatus: "success",
          },
        });
      } catch (e) {
        dispatch({
          type: MOVIE_TITLE_SECTION_ADDED,
          payload: {
            id: movieId,
            sectionId,
            sectionStatus: "error",
            error: "cors",
          },
        });
      }
    }
  };
};

export {
  addMovieTitle,
  addMovieTitleSection,
  MOVIE_TITLE_ADDED,
  MOVIE_TITLE_SECTION_ADDED,
};
export interface MovieTitleActionTypes {
  [MOVIE_TITLE_SECTION_ADDED]: MovieTitleSection;
  [MOVIE_TITLE_ADDED]: MovieTitle;
}
