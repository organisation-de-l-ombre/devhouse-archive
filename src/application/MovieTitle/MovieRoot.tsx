import React from "react";
import { RouteComponentProps } from "react-router";
import { Trans, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import { useNotificationsManager } from "@hooks/Notifications";
import { useLanguage } from "@hooks/Language";
import { FlexContainer, GenericLoader } from "@components/ui";
import { NotFound, BackToTop } from "@components/modules";
import globalStyles from "../../themes/Global.module.scss";
import MovieHeaders from "./modules/MovieHeaders/MovieHeaders";
import MovieInternalNavigation from "./modules/MovieInternalNavigation/MovieInternalNavigation";
import MovieRouter from "./modules/Router/MovieRouter";
import { S3DataResponse } from "./types";

const fetchMovieData = async (
  movieTitle: string,
  language: string,
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
): Promise<S3DataResponse | undefined> => {
  try {
    const { dataURL: APIResponse } = await fetch(
      `https://amelia-api.developershouse.xyz/data/movies/title/${movieTitle}/${language}`
    ).then((response) => response.json());

    if (APIResponse) {
      try {
        const S3Response = await fetch(APIResponse).then((res) => res.json());

        setIsFetching(false);

        if (S3Response) {
          return S3Response;
        }
      } catch {
        setIsFetching(false);

        return undefined;
      }
    }
  } catch {
    setIsFetching(false);

    return undefined;
  }

  setIsFetching(false);

  return undefined;
};

const MovieRoot: React.FC<RouteComponentProps> = ({ match }) => {
  const { language } = useLanguage();
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [view, setView] = React.useState<S3DataResponse | undefined>(undefined);
  const { addNotifications, deleteNotification } = useNotificationsManager();
  const { t } = useTranslation("pages\\moviePrototype\\root");

  React.useEffect(() => {
    setIsFetching(true);

    fetchMovieData(
      (match.params as Record<string, unknown>).title as string,
      language,
      setIsFetching
    ).then((response: S3DataResponse | undefined): void => {
      setView(response);
    });
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
        className={`${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]}`}
      >
        <GenericLoader>
          <Trans t={t} i18nKey="fetchingData" />
        </GenericLoader>
      </FlexContainer>
    );
  }

  if (view === undefined) {
    return <NotFound />;
  }

  return (
    <FlexContainer
      className={`${globalStyles.column} ${globalStyles["navbar-margin"]}`}
    >
      <MovieHeaders dataResponse={view} />
      <MovieInternalNavigation dataResponse={view} />
      <BackToTop href="#movie-page-navigation" />
      <MovieRouter dataResponse={view} />
    </FlexContainer>
  );
};

export default MovieRoot;
