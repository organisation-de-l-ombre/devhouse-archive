import { useCallback } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { useNotificationsManager } from "./useNotifications";
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

const useLinkedAccounts = (): UseQueryResult<string> => {
  const criticalError = useCriticalError();

  return useQuery("account/linked-accounts", () => UserAPI.selfLinksGet(), {
    onError: criticalError,
  });
};

export default useLinkedAccounts;
