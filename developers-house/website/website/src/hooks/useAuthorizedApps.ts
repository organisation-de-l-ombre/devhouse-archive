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
import { GlobalGraphQLClient } from "../constants";

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
  return useQuery("authorized_apps", requestAuthorizedApps);
};

export const useAuthorizedAppsDeleteMutation = (
  authorizedApp: string
): {
  remove: UseMutateFunction<number>;
} => {
  const client = useQueryClient();
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
      onError(err, variables, previousValue) {
        client.setQueryData("authorized_apps", previousValue);
      },
    }
  );

  return {
    remove: mutate,
  };
};

export const useAuthorizedAppsAllDelete = (): UseMutateFunction => {
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
      },
    }
  );
  return mutate;
};

export default useAuthorizedApps;
