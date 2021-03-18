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
import { useCriticalError } from "./useAuthorizedApps";

const getTakeouts = gql`
  query {
    listTakeouts {
      status
      uuid
      link
      expire
      services {
        name
        status
      }
    }
  }
`;

const createTakeout = gql`
  mutation {
    createTakeout {
      uuid
      status
      link
      expire
    }
  }
`;

export type Takeout = {
  status: string;
  uuid: string;
  link?: string;
  expire: number;
  services: {
    name: string;
    status: string;
  }[];
};

const requestsTakeouts = async () => {
  const data = await GlobalGraphQLClient.request<{
    listTakeouts: Takeout[];
  }>(getTakeouts);
  return data.listTakeouts;
};

const doCreateTakeout = async () => {
  const takeout = await GlobalGraphQLClient.request<{
    createTakeout: Takeout;
  }>(createTakeout);
  return takeout.createTakeout;
};

export const useTakeouts = (): QueryObserverResult<Takeout[], Error> => {
  const criticalError = useCriticalError();
  return useQuery("takeouts", requestsTakeouts, {
    onError: criticalError,
  });
};

export const useCreateTakeout = (): UseMutateFunction<Takeout, Error> => {
  const criticalError = useCriticalError();
  const client = useQueryClient();
  const { mutate } = useMutation<Takeout, Error>(
    "create_takeout",
    doCreateTakeout,
    {
      onSuccess(data) {
        client.setQueryData<Takeout[]>("takeouts", (old = []) => {
          return [
            ...old,
            {
              ...data,
              services: [],
            },
          ];
        });
      },
      onError: (error) => criticalError(error) && undefined,
    }
  );
  return mutate;
};

export default useTakeouts;
