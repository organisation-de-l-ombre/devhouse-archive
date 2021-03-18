/**
 * @author Matthieu
 */
import {
  QueryObserverResult,
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { gql } from "graphql-request";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { GlobalGraphQLClient } from "../constants";
import { getClientId, logoutUser } from "../state/modules/user/actions";
import { pushNotification } from "../state/modules/notifications";

const authorizedApps = gql`
  query {
    authorizedClients {
      client_id
      client_name
      grantedAt
      audiences
      scopes
    }
  }
`;

export type Client = {
  client_id: string;
  client_name: string;
  grantedAt: string;
  audiences: string[];
  scopes: string[];
};

export const useCriticalError = (): ((err: Error) => Error) => {
  const dispatch = useDispatch();
  return useCallback(
    (err?: Error) => {
      dispatch(
        pushNotification({
          level: "error",
          text: `Failed to communicate with the server. ${err?.message || ""}`,
          time: 5000,
        })
      );
      return err || Error("Network error.");
    },
    [dispatch]
  );
};

const requestAuthorizedApps = async () => {
  const data = await GlobalGraphQLClient.request<{
    authorizedClients: Client[];
  }>(authorizedApps);
  return data.authorizedClients;
};

const deleteAuthorizedApp = async (client_id: string) => {
  const data = await GlobalGraphQLClient.request<{
    deleteAuthorizedClients: number;
  }>(
    `
  mutation($id: String!) {
    deleteAuthorizedClients(clientId: $id)
  }
`,
    {
      id: client_id,
    }
  );
  return data.deleteAuthorizedClients;
};

const deleteAllAuthorizedApp = async () => {
  const data = await GlobalGraphQLClient.request<{
    deleteAuthorizedClients: number;
  }>(
    `
mutation {
  deleteAllAuthorizedClients
}
`
  );
  return data.deleteAuthorizedClients;
};

export const useAuthorizedApps = (): QueryObserverResult<Client[], Error> => {
  const criticalError = useCriticalError();
  return useQuery("authorized_apps", requestAuthorizedApps, {
    onError: criticalError,
  });
};

export const useAuthorizedAppsDeleteMutation = (
  authorizedApp: string
): {
  remove: UseMutateFunction<number>;
} => {
  const client = useQueryClient();
  const dispatch = useDispatch();
  const criticalError = useCriticalError();
  const { mutate } = useMutation<number>(
    "delete_authorized_apps",
    () => deleteAuthorizedApp(authorizedApp),
    {
      async onMutate() {
        await client.cancelQueries("authorized_apps");
        client.setQueryData<Client[]>("authorized_apps", (old) => {
          if (old) {
            return old.filter((x) => x.client_id !== authorizedApp);
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

export const useAuthorizedAppsAllDelete = (): UseMutateFunction => {
  const criticalError = useCriticalError();
  const dispatch = useDispatch();
  const client = useQueryClient();
  const { mutate } = useMutation<number>(
    "delete_all_authorized_apps",
    () => deleteAllAuthorizedApp(),
    {
      async onMutate() {
        await client.cancelQueries("authorized_apps");
        client.setQueryData<Client[]>("authorized_apps", () => {
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
