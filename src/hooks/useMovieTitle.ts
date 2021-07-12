/* eslint-disable react-hooks/rules-of-hooks */
import { MovieDataResponse } from "@developers-house/amelia";
import { MovieDataAPI } from "@lib/api";
import { addMovieTitle, addMovieTitleSection } from "@store/movieTitle/actions";
import { MovieTitle, MovieTitleSections } from "@store/movieTitle/types";
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
  section: keyof MovieTitleSections
): T | undefined => {
  return useSelector((state: GlobalState): T | undefined => {
    const movieTitle: MovieTitle = state.movieTitle[movieId];

    if (movieTitle.rootStatus !== "success") {
      return undefined;
    }

    return movieTitle.sections[section as never];
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
  section: keyof MovieTitleSections
): T | undefined => {
  const dispatch = useDispatch();
  const movieTitle = useMovieTitleState(movieId) as MovieTitle;

  if (movieTitle.rootStatus !== "success") {
    return undefined;
  }

  const fetchMovieSection = useCallback(async (): Promise<void> => {
    const { data }: AxiosResponse<T> = await axios.get(
      movieTitle.data[section as never]
    );

    if (data) {
      dispatch(addMovieTitleSection(movieId, section, data as never));
    }
  }, [dispatch, movieId, movieTitle.data, section]);

  usePreload(fetchMovieSection);

  const movieSection = useMovieTitleSectionState<T>(movieId, section);

  useEffect((): void => {
    if (!movieSection) {
      fetchMovieSection();
    }
  }, [fetchMovieSection, movieSection]);

  return movieSection;
};

export { useMovieTitleState, useMovieTitleRoot, useMovieTitleSection };
