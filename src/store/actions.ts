import { AccountActionsTypes } from "./account/actions";
import { LanguageActionTypes } from "./language/actions";
import { MovieTitleActionTypes } from "./movieTitle/actions";
import { NotificationsConfigActionTypes } from "./notifications/notificationsConfig/actions";
import { NotificationsDataActionTypes } from "./notifications/notificationsData/actions";
import { PropertiesActionTypes } from "./properties/actions";
import { ThemeActionTypes } from "./theme/actions";

export type ReduxActions = AccountActionsTypes &
  PropertiesActionTypes &
  LanguageActionTypes &
  MovieTitleActionTypes &
  NotificationsConfigActionTypes &
  NotificationsDataActionTypes &
  ThemeActionTypes;
