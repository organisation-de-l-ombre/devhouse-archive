import React from "react";
import { RouteComponentProps } from "react-router";
import { Trans, useTranslation } from "react-i18next";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import MovieHeaders from "./modules/MovieHeaders/MovieHeaders";
import MovieInternalNavigation from "./modules/MovieInternalNavigation/MovieInternalNavigation";
import MovieRouter from "./modules/Router/MovieRouter";
import NotFound from "../../components/modules/NotFound/NotFound";
import { MovieObject } from "./Types";
import BackToTop from "../../components/modules/BackToTop/BackToTop";
import { useNotificationsManager } from "../../hooks/Notifications/Notifications";
import generateNotificationID from "../../lib/generateNotificationID";
import useLanguage from "../../hooks/Language/Language";
import GenericLoader from "../../components/ui/GenericLoader/GenericLoader";

const fetchMovieData = async (
  movieTitle: string,
  language: string,
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>
): Promise<MovieObject | undefined> => {
  try {
    const { dataURL: APIResponse } = await fetch(
      `http://amelia-api.developershouse.xyz/data/movies/title/${movieTitle}/${language}`
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
  const [view, setView] = React.useState<undefined | MovieObject>(undefined);
  const { addNotifications, deleteNotification } = useNotificationsManager();
  const { t } = useTranslation("pages\\moviePrototype\\root");

  React.useEffect(() => {
    setIsFetching(true);

    fetchMovieData(
      (match.params as Record<string, unknown>).title as string,
      language,
      setIsFetching
    ).then((response: MovieObject | undefined): void => {
      setView(response);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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
        className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]}`}
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
      className={`${flexContainerStyles.container} ${globalStyles.column}`}
    >
      <MovieHeaders dataResponse={view} />
      <MovieInternalNavigation dataResponse={view} />
      <BackToTop />
      <MovieRouter dataResponse={view} />
    </FlexContainer>
  );
};

export default MovieRoot;
