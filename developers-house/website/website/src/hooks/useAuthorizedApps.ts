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

const useCriticalError = () => {
  const dispatch = useDispatch();
  return useCallback((err) => {
    console.log(err);
    dispatch(
      pushNotification({
        level: "error",
        text: "You got logged out. Your session expired.",
        time: 5000,
      })
    );
    dispatch(logoutUser());
  }, [dispatch]);
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

export const useAuthorizedApps = (): QueryObserverResult<Client[], unknown> => {
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
          criticalError();
        }
      },
      onError(err, variables, previousValue) {
        client.setQueryData("authorized_apps", previousValue);
        criticalError(err);
      },
    }
  );

  return {
    remove: mutate,
  };
};

export const useAuthorizedAppsAllDelete = (): UseMutateFunction => {
  const criticalError = useCriticalError();
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
        criticalError(err);
      },
      onSuccess() {
        criticalError();
      },
    }
  );
  return mutate;
};

export default useAuthorizedApps;
