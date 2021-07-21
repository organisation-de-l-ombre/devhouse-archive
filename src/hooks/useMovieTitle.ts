import { MovieDataResponse } from "@developers-house/amelia";
import { MovieDataAPI } from "@lib/api";
import { addMovieTitle, addMovieTitleSection } from "@store/movieTitle/actions";
import {
  MovieTitle,
  MovieTitleSection,
  MovieTitleSections,
  MovieTitleSuccess,
} from "@store/movieTitle/types";
import { GlobalState } from "@store/types";
import axios, { AxiosResponse } from "axios";
import { useDispatch, useSelector } from "react-redux";
import usePreload from "@hooks/usePreload";
import { useCallback, useEffect } from "react";
import useLanguage from "./useLanguage";

const useMovieTitleState = (movieId: string): MovieTitle | undefined => {
  return useSelector(({ movieTitle }: GlobalState) => movieTitle[movieId]);
};

const useMovieTitleSectionState = <T>(
  movieId: string,
  sectionId: keyof MovieTitleSections
): T | undefined => {
  return useSelector((state: GlobalState): T | undefined => {
    const movieTitle: MovieTitle | undefined = state.movieTitle[movieId];

    if (!movieTitle || (movieTitle && movieTitle.rootStatus !== "success")) {
      return undefined;
    }

    return movieTitle.sections[sectionId] as T | undefined;
  });
};

const useMovieTitleRoot = (movieId: string): MovieTitle | undefined => {
  const { language } = useLanguage();
  const dispatch = useDispatch();
  const fetchMovieTitle = useCallback(async (): Promise<void> => {
    dispatch(
      addMovieTitle({
        id: movieId,
        rootStatus: "loading",
      })
    );

    try {
      const { data, status }: AxiosResponse<MovieDataResponse> =
        await MovieDataAPI.getMovieData(movieId, language);

      if (!data) {
        switch (status) {
          case 503: {
            dispatch(
              addMovieTitle({
                id: movieId,
                rootStatus: "error",
                error: "internal",
                statusCode: status,
              })
            );

            break;
          }

          case 404: {
            dispatch(
              addMovieTitle({
                id: movieId,
                rootStatus: "error",
                error: "not-found",
                statusCode: status,
              })
            );

            break;
          }

          case 401: {
            dispatch(
              addMovieTitle({
                id: movieId,
                rootStatus: "error",
                error: "unauthorized",
                statusCode: status,
              })
            );

            break;
          }

          default: {
            dispatch(
              addMovieTitle({
                id: movieId,
                rootStatus: "error",
                error: "other",
                statusCode: status,
              })
            );

            break;
          }
        }

        return;
      }

      dispatch(
        addMovieTitle({
          rootStatus: "success",
          ...data,
          sections: {},
        })
      );
    } catch {
      dispatch(
        addMovieTitle({
          id: movieId,
          rootStatus: "error",
          error: "cors",
        })
      );
    }
  }, [dispatch, language, movieId]);

  usePreload(fetchMovieTitle);

  const movieTitle = useMovieTitleState(movieId);

  useEffect((): void => {
    if (!movieTitle) {
      fetchMovieTitle();
    }
  }, [fetchMovieTitle, movieTitle]);

  return movieTitle;
};

const useMovieTitleSection = <T>(
  movieId: string,
  sectionId: keyof MovieTitleSections
): MovieTitleSection<T> | undefined => {
  const { data: s3Links } = useMovieTitleState(movieId) as MovieTitleSuccess;
  const dispatch = useDispatch();
  const fetchMovieSection = useCallback(async (): Promise<void> => {
    dispatch(
      addMovieTitleSection({
        id: movieId,
        sectionId,
        sectionStatus: "loading",
      })
    );

    try {
      const { data, status }: AxiosResponse = await axios.get(
        s3Links[sectionId as never] || ""
      );

      if (!data) {
        switch (status) {
          case 503: {
            dispatch(
              addMovieTitleSection({
                id: movieId,
                sectionId,
                sectionStatus: "error",
                error: "internal",
                statusCode: status,
              })
            );

            break;
          }

          case 404: {
            dispatch(
              addMovieTitleSection({
                id: movieId,
                sectionId,
                sectionStatus: "error",
                error: "not-found",
                statusCode: status,
              })
            );

            break;
          }

          case 401: {
            dispatch(
              addMovieTitleSection({
                id: movieId,
                sectionId,
                sectionStatus: "error",
                error: "unauthorized",
                statusCode: status,
              })
            );

            break;
          }

          default: {
            dispatch(
              addMovieTitleSection({
                id: movieId,
                sectionId,
                sectionStatus: "error",
                error: "other",
                statusCode: status,
              })
            );

            break;
          }
        }

        return;
      }

      dispatch(
        addMovieTitleSection({
          id: movieId,
          sectionId,
          sectionStatus: "success",
          ...data,
        })
      );
    } catch {
      dispatch(
        addMovieTitleSection({
          id: movieId,
          sectionId,
          sectionStatus: "error",
          error: "cors",
        })
      );
    }
  }, [dispatch, movieId, s3Links, sectionId]);

  const movieSection = useMovieTitleSectionState<MovieTitleSection<T>>(
    movieId,
    sectionId
  );

  useEffect((): void => {
    if (!movieSection) {
      fetchMovieSection();
    }
  }, [fetchMovieSection, movieSection]);

  return movieSection;
};

export {
  useMovieTitleState,
  useMovieTitleSectionState,
  useMovieTitleRoot,
  useMovieTitleSection,
};
