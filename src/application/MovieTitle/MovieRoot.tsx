import React, { FC } from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { FlexContainer } from "@components/ui";
import { MetadataBuilder, withNetwork } from "@components/modules";
import loadable from "@loadable/component";
import { MovieTitleParams } from "@typings/movieTitle";
import { useMovieTitleRoot } from "@hooks/useMovieTitle";

const SuspenseComponent = loadable(
  () => import("@components/modules/Suspense/Suspense")
);
const ErrorComponent = loadable(
  () => import("@components/modules/Error/ErrorComponent")
);
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);
const Headers = loadable(() => import("./modules/Headers/Headers"));
const InternalNavigation = loadable(
  () => import("./modules/InternalNavigation/InternalNavigation")
);
const BackToTop = loadable(
  () => import("@components/modules/BackToTop/BackToTop")
);
const Router = loadable(() => import("./modules/Router/Router"));

const MovieRoot: FC<RouteComponentProps> = ({ match }) => {
  const { t } = useTranslation("root");
  const { t: tMedia } = useTranslation("media\\media");
  const { movieId } = match.params as unknown as MovieTitleParams;
  const movieTitle = useMovieTitleRoot(movieId);

  if (!movieTitle) {
    return null;
  }

  if (movieTitle.rootStatus === "loading") {
    return <SuspenseComponent minHeight customText={t("utils.apiFetch")} />;
  }

  if (movieTitle.rootStatus === "error") {
    if (movieTitle.error === "cors" || movieTitle.error === "internal") {
      return (
        <ErrorComponent
          errorMessage={t("error.messages.generic", { statusCode: 503 })}
        />
      );
    }

    if (movieTitle.error === "not-found") {
      return <NotFound />;
    }

    return (
      <ErrorComponent
        errorMessage={t("error.messages.generic", {
          statusCode: movieTitle.statusCode,
        })}
      />
    );
  }

  return (
    <FlexContainer column>
      <MetadataBuilder
        title={`${movieTitle.localizedInformation.title} (${movieTitle.title}) - IMR`}
        embedTitle={`${movieTitle.localizedInformation.title} (${movieTitle.title})`}
        description={movieTitle.localizedInformation.description}
        image={`https://cdn.developershouse.xyz/${movieTitle.localizedInformation.poster}`}
        keywords={movieTitle.tags.map((tag: string): string =>
          tMedia(`tags.${tag}`)
        )}
      />
      <Headers dataResponse={movieTitle} />
      <InternalNavigation dataResponse={movieTitle} />
      <BackToTop />
      <Router dataResponse={movieTitle} />
    </FlexContainer>
  );
};

export default withNetwork(MovieRoot);
