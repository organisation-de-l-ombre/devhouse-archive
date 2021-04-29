import React from "react";
import { RouteComponentProps } from "react-router";
import { Trans, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import { useNotificationsManager } from "@hooks/Notifications";
import { useLanguage } from "@hooks/Language";
import { FlexContainer, GenericLoader } from "@components/ui";
import { NotFound, BackToTop } from "@components/modules";
import { MovieDataAPI } from "@lib/api";
import { InlineResponse200 } from "@developers-house/amelia";
import globalStyles from "../../themes/Global.module.scss";
import MovieHeaders from "./modules/MovieHeaders/MovieHeaders";
import MovieInternalNavigation from "./modules/MovieInternalNavigation/MovieInternalNavigation";
import MovieRouter from "./modules/Router/MovieRouter";
import { S3DataResponse } from "./types";
import containerStyle from "./Containers.module.scss";

const MovieRoot: React.FC<RouteComponentProps> = ({ match }) => {
  const { language } = useLanguage();
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [view, setView] = React.useState<S3DataResponse | undefined>(undefined);
  const { addNotifications, deleteNotification } = useNotificationsManager();
  const { t } = useTranslation("pages\\moviePrototype\\root");
  const params = (match.params as unknown) as Record<string, string>;
  const fetchMovieData = React.useCallback((): void => {
    setIsFetching(true);

    MovieDataAPI.getMovieData({
      movieTitle: params.title,
      language,
    }).then((response: InlineResponse200): void => {
      if (response.dataURL) {
        fetch(response.dataURL)
          .then((S3Response) => S3Response.json())
          .then((S3Response: S3DataResponse): void => {
            setView(S3Response);
          });
      }
    });

    setIsFetching(false);
  }, [language, params.title]);

  React.useEffect(() => {
    fetchMovieData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect((): (() => void) => {
    const id: string = generateNotificationID();

    addNotifications([
      {
        id,
        type: "warning",
        body: t("warning"),
        time: 10000,
      },
    ]);

    return () => deleteNotification(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFetching) {
    return (
      <FlexContainer
        className={`${containerStyle["is-fetching-root"]} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]}`}
      >
        <GenericLoader className={containerStyle["is-fetching"]}>
          <Trans t={t} i18nKey="fetchingData" />
        </GenericLoader>
      </FlexContainer>
    );
  }

  if (view === undefined) {
    return <NotFound />;
  }

  return (
    <FlexContainer className={globalStyles.column}>
      <MovieHeaders dataResponse={view} />
      <MovieInternalNavigation />
      <BackToTop />
      <MovieRouter dataResponse={view} />
    </FlexContainer>
  );
};

export default MovieRoot;
