import React from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import { useNotificationsManager } from "@hooks/Notifications";
import { useLanguage } from "@hooks/Language";
import { FlexContainer } from "@components/ui";
import { NotFound, BackToTop, Suspense } from "@components/modules";
import { MovieDataAPI } from "@lib/api";
import { useQuery, UseQueryResult } from "react-query";
import { Helmet } from "react-helmet";
import fetchOptions from "@lib/api/fetchOptions";
import { InlineResponse200 } from "@developers-house/amelia";
import globalStyles from "../../themes/Global.module.scss";
import Headers from "./modules/Headers/Headers";
import InternalNavigation from "./modules/InternalNavigation/InternalNavigation";
import Router from "./modules/Router/Router";
import { RootResponse } from "./types/global/RootResponse";

const MovieRoot: React.FC<RouteComponentProps> = ({ match }) => {
  const { language } = useLanguage();
  const { addNotifications, deleteNotification } = useNotificationsManager();
  const { t } = useTranslation("pages\\movieTitle\\root");
  const params = (match.params as unknown) as Record<string, string>;
  const { isFetching, data }: UseQueryResult<RootResponse> = useQuery(
    `movie-title/${params.title}/root`,
    (): Promise<InlineResponse200> => {
      return MovieDataAPI.getMovieData({
        movieTitle: params.title,
        language,
      });
    },
    fetchOptions
  );

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
    return <Suspense minHeight customText={t("fetchingData")} />;
  }

  if (data === undefined) {
    return <NotFound />;
  }

  return (
    <FlexContainer className={globalStyles.column}>
      <Helmet>
        <title>{data.title} - IMR</title>
      </Helmet>
      <Headers dataResponse={data} />
      <InternalNavigation dataResponse={data} />
      <BackToTop />
      <Router dataResponse={data} />
    </FlexContainer>
  );
};

export default MovieRoot;
