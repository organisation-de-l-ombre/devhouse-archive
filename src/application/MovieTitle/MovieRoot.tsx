import React, { FC, lazy } from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import useLanguage from "@hooks/useLanguage";
import { FlexContainer } from "@components/ui";
import { withNetwork } from "@components/modules";
import { MovieDataAPI, fetchOptions } from "@lib/api";
import { useQuery, UseQueryResult } from "react-query";
import { Helmet } from "react-helmet";
import { MovieDataResponse } from "@developers-house/amelia";

const SuspenseComponent = lazy(
  () => import("@components/modules/Suspense/SuspenseComponent")
);
const ErrorComponent = lazy(
  () => import("@components/modules/Error/ErrorComponent")
);
const NotFound = lazy(() => import("@components/modules/NotFound/NotFound"));
const Headers = lazy(() => import("./modules/Headers/Headers"));
const InternalNavigation = lazy(
  () => import("./modules/InternalNavigation/InternalNavigation")
);
const BackToTop = lazy(() => import("@components/modules/BackToTop/BackToTop"));
const Router = lazy(() => import("./modules/Router/Router"));

const MovieRoot: FC<RouteComponentProps> = ({ match }) => {
  const { language } = useLanguage();
  const { t } = useTranslation("root");
  const params = match.params as unknown as Record<string, string>;
  const {
    error,
    isFetching,
    data,
  }: UseQueryResult<MovieDataResponse, TypeError | Response> = useQuery(
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
    return <SuspenseComponent minHeight customText={t("utils.apiFetch")} />;
  }

  if (error && error instanceof TypeError) {
    return (
      <ErrorComponent
        errorMessage={t("error.messages.generic", { statusCode: 503 })}
      />
    );
  }

  if (error && error instanceof Response && error.status !== 404) {
    return (
      <ErrorComponent
        errorMessage={t("error.messages.generic", { statusCode: error.status })}
      />
    );
  }

  if ((error && error instanceof Response && error.status === 404) || !data) {
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

export default withNetwork(MovieRoot);
