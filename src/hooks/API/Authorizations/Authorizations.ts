import {
  QueryObserverResult,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Authorization } from "@developers-house/abdera";
import { useTranslation } from "react-i18next";
import { DevHouseUserAPI } from "@lib/api";
import generateNotificationID from "@lib/generateNotificationID";
import getApplicationID from "@lib/getApplicationID";
import { useNotificationsManager } from "@hooks/Notifications";
import { useUser } from "@hooks/User";

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
const useAuthorizations = (): QueryObserverResult<
  Authorization[] | undefined
> => {
  useAuthorizationsError();

  return useQuery("account_authorizations", () =>
    DevHouseUserAPI.selfAuthorizationsGet()
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
        await client.cancelQueries("account_authorizations");

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
      onSuccess() {
        addNotifications([
          {
            id: generateNotificationID(),
            type: "info",
            body: t("hooks.authorizationDeleted"),
            time: 5000,
          },
        ]);

        const applicationID: string = getApplicationID();

        if (applicationID === id) {
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
        client.setQueryData("account_authorizations", previousValue);

        if (error) {
          criticalError(new Error(error as string));
        }
      },
    }
  );

  return { remove: mutate };
};

export { useAuthorizations, useAuthorizationsDeleteMutation };
