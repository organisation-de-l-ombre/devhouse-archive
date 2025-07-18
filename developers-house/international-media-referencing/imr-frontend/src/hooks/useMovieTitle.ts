import { addMovieTitle, addMovieTitleSection } from "@store/movieTitle/actions";
import {
  MovieTitle,
  MovieTitleSection,
  MovieTitleSections,
} from "@store/movieTitle/types";
import { GlobalState } from "@store/types";
import { useDispatch, useSelector } from "react-redux";
import usePreload from "@hooks/usePreload";
import { useCallback, useEffect } from "react";
import { Section } from "@typings/movieTitle";
import useLanguage from "./useLanguage";

const useMovieTitle = (movieId: string): MovieTitle | undefined => {
  return useSelector(({ movieTitle }: GlobalState) => movieTitle[movieId]);
};

const useMovieTitleRoot = (movieId: string): MovieTitle | undefined => {
  const language = useLanguage();
  const dispatch = useDispatch();
  usePreload(async (getState) => {
    const promiseLoad = addMovieTitle(movieId, language);
    if (typeof promiseLoad === "function") {
      await promiseLoad(dispatch, () => getState, {});
    }
  });

  const movieTitle = useMovieTitle(movieId);

  useEffect((): void => {
    if (!movieTitle) {
      dispatch(addMovieTitle(movieId, language));
    }
  }, [movieTitle, language, movieId, dispatch]);

  return movieTitle;
};

const useMovieTitleSection = <T extends Section>(
  movieId: string,
  sectionId: keyof MovieTitleSections
): MovieTitleSection<T> | null => {
  const dispatch = useDispatch();

  const fetchMovieSection = useCallback(async (): Promise<void> => {
    dispatch(addMovieTitleSection(movieId, sectionId));
  }, [dispatch, movieId, sectionId]);

  const movieSection = useSelector((state): MovieTitleSection<T> | null => {
    if (!state.movieTitle[movieId]) {
      return null;
    }

    const title = state.movieTitle[movieId];
    if (title.rootStatus === "success") {
      const section = title.sections[sectionId];
      if (!section) {
        return null;
      }
      return section;
    }
    return null;
  });

  useEffect((): void => {
    if (!movieSection) {
      fetchMovieSection();
    }
  }, [fetchMovieSection, movieSection]);

  return movieSection;
};

export { useMovieTitleRoot, useMovieTitleSection };
