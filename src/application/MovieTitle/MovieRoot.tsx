import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import useLanguage from "@hooks/useLanguage";
import { FlexContainer } from "@components/ui";
import {
  NotFound,
  BackToTop,
  SuspenseComponent,
  ErrorComponent,
} from "@components/modules";
import { MovieDataAPI, fetchOptions } from "@lib/api";
import { useQuery, UseQueryResult } from "react-query";
import { Helmet } from "react-helmet";
import { MovieDataResponse } from "@developers-house/amelia";
import Headers from "./modules/Headers/Headers";
import InternalNavigation from "./modules/InternalNavigation/InternalNavigation";
import Router from "./modules/Router/Router";

const MovieRoot: FC<RouteComponentProps> = ({ match }) => {
  const { language } = useLanguage();
  const { t } = useTranslation("pages\\movieTitle\\root");
  const params = (match.params as unknown) as Record<string, string>;
  const {
    error,
    isFetching,
    data,
  }: UseQueryResult<MovieDataResponse, Response> = useQuery(
    `movie-title/${params.title}/${language}/root`,
    (): Promise<MovieDataResponse> => {
      return MovieDataAPI.getMovieData({
        movieTitle: params.title,
        language,
      });
    },
    fetchOptions
  );

  if (isFetching) {
    return <SuspenseComponent minHeight customText={t("fetchingData")} />;
  }

  if (error && error.status !== 404) {
    return (
      <ErrorComponent errorMessage={t("error", { statusCode: error.status })} />
    );
  }

  if ((error && error.status === 404) || !data) {
    return <NotFound />;
  }

  return (
    <FlexContainer column>
      <Helmet>
        <title>{data.body.title} - IMR</title>
      </Helmet>
      <Headers dataResponse={data} />
      <InternalNavigation dataResponse={data} />
      <BackToTop />
      <Router dataResponse={data} />
    </FlexContainer>
  );
};

export default MovieRoot;
