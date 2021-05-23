import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { Authorization } from "@developers-house/abdera";
import { useTranslation } from "react-i18next";
import { DevHouseUserAPI, fetchOptions } from "@lib/api";
import generateNotificationID from "@lib/generateNotificationID";
import getApplicationID from "@lib/getApplicationID";
import { useNotificationsManager } from "@hooks/useNotifications";
import useUser from "@hooks/useUser";

const useAuthorizationsError = (): ((error?: Error) => Error) => {
  const { t } = useTranslation("pages\\account\\sections\\authorizations");
  const { addNotifications } = useNotificationsManager();

  return (error?: Error): Error => {
    addNotifications([
      {
        id: generateNotificationID(),
        type: "error",
        body: t("hooks.error"),
        time: 5000,
      },
    ]);

    return error || Error("Authorization data error");
  };
};

const useAuthorizations = (): UseQueryResult<
  Authorization[] | undefined,
  Response
> => {
  useAuthorizationsError();

  return useQuery(
    "account/authorizations",
    () => DevHouseUserAPI.selfAuthorizationsGet(),
    fetchOptions
  );
};

const useAuthorizationsDeleteMutation = (
  id: string
): {
  remove: UseMutateFunction<void>;
} => {
  const client = useQueryClient();
  const criticalError = useAuthorizationsError();
  const { t } = useTranslation("pages\\account\\sections\\authorizations");
  const { t: tAccount } = useTranslation("pages\\account\\sections\\account");
  const { removeUser } = useUser();
  const { addNotifications } = useNotificationsManager();
  const { mutate } = useMutation(
    "delete_account_authorizations",
    () => DevHouseUserAPI.selfAuthorizationsDelete({ clientId: id }),
    {
      async onMutate() {
        await client.cancelQueries("account/authorizations");

        client.setQueryData<Authorization[]>(
          "account/authorizations",
          (oldAuthorizations) => {
            if (oldAuthorizations) {
              return oldAuthorizations.filter(
                (authorization) => authorization.client.id !== id
              );
            }

            return [];
          }
        );
      },
      async onSuccess() {
        addNotifications([
          {
            id: generateNotificationID(),
            type: "info",
            body: t("hooks.authorizationDeleted"),
            time: 5000,
          },
        ]);

        const clientID: string = await getApplicationID();

        if (clientID === "Invalid client ID") {
          return;
        }
        if (clientID === id) {
          removeUser();
          addNotifications([
            {
              id: generateNotificationID(),
              type: "info",
              body: tAccount("devHouse.loggedOut"),
              time: 5000,
            },
          ]);
        }
      },
      onError(error, variables, previousValue) {
        client.setQueryData("account/authorizations", previousValue);

        if (error) {
          criticalError(new Error(error as string));
        }
      },
    }
  );

  return { remove: mutate };
};

export { useAuthorizations, useAuthorizationsDeleteMutation };
