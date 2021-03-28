import React from "react";
import { RouteComponentProps } from "react-router";
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

const MovieRoot: React.FC<RouteComponentProps> = ({ match }) => {
  const [view, setView] = React.useState<null | MovieObject>(null);

  React.useEffect(() => {
    Promise.resolve(
      import(
        `./prototypes/${(match.params as Record<string, unknown>).title}.json`
      )
    )
      .then((response) => setView(response))
      .catch(() => setView(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { addNotifications, deleteNotification } = useNotificationsManager();

  React.useEffect((): (() => void) => {
    const id: string = generateNotificationID();

    addNotifications([
      {
        id,
        type: "warning",
        body:
          "Vous utilisez une version preview de la version finale. Cette version contient des bugs et n'est pas complète. Vous y naviguez à vos risques et périls.",
        time: 10000,
      },
    ]);

    return () => deleteNotification(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (view === null) {
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
