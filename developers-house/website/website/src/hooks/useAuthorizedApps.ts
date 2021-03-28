import {
  QueryObserverResult,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { Authorization } from "@developers-house/abdera";
import { getClientId, logoutUser } from "../state/modules/user/actions";
import { useNotificationsManager } from "./Notifications/Notifications";
import { UserAPI } from "../Root";

const useCriticalError = (): ((err: Error) => Error) => {
  const { addNotification } = useNotificationsManager();

  return useCallback(
    (err?: Error) => {
      addNotification({
        level: "error",
        text: `Failed to communicate with the server. ${err?.message || ""}`,
        time: 5000,
      });

      return err || Error("Network error.");
    },
    [addNotification]
  );
};

const useAuthorizedApps = (): QueryObserverResult<Authorization[], Error> => {
  const criticalError = useCriticalError();

  return useQuery("authorized_apps", () => UserAPI.selfAuthorizationsGet(), {
    onError: criticalError,
  });
};

const useAuthorizedAppsDeleteMutation = (
  authorizedApp: string
): {
  remove: UseMutateFunction<void>;
} => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const criticalError = useCriticalError();
  const { mutate } = useMutation(
    "delete_authorized_apps",
    () => UserAPI.selfAuthorizationsDelete({ clientId: authorizedApp }),
    {
      async onMutate() {
        await client.cancelQueries("authorized_apps");

        client.setQueryData<Authorization[]>("authorized_apps", (old) => {
          if (old) {
            return old.filter((x) => x.client.id !== authorizedApp);
          }

          return [];
        });
      },
      onSuccess() {
        if (getClientId() === authorizedApp) {
          dispatch(logoutUser());
        }
      },
      onError(err, variables, previousValue) {
        client.setQueryData("authorized_apps", previousValue);

        if (err) {
          criticalError(new Error(err as string));
        }
      },
    }
  );

  return {
    remove: mutate,
  };
};

const useAuthorizedAppsAllDelete = (): UseMutateFunction => {
  const criticalError = useCriticalError();
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { mutate } = useMutation(
    "delete_all_authorized_apps",
    () => UserAPI.selfAuthorizationsDelete({ clientId: "" }),
    {
      async onMutate() {
        await client.cancelQueries("authorized_apps");

        client.setQueryData<Authorization[]>("authorized_apps", () => {
          return [];
        });
      },
      onError(err, variables, previousValue) {
        client.setQueryData("authorized_apps", previousValue);

        if (err) {
          criticalError(new Error(err as string));
        }
      },
      onSuccess() {
        dispatch(logoutUser());
      },
    }
  );
  return mutate;
};

export {
  useCriticalError,
  useAuthorizedApps,
  useAuthorizedAppsDeleteMutation,
  useAuthorizedAppsAllDelete,
};
