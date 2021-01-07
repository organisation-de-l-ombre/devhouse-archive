/**
 * @author Matthieu
 */
import {
  MutationObserverResult,
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
import { logoutUser } from "../state/modules/user/actions";
import { pushNotification } from "../state/modules/notifications";

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

const useCriticalError = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
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

export const useTakeouts = (): QueryObserverResult<Takeout[], unknown> => {
  const criticalError = useCriticalError();
  return useQuery("takeouts", requestsTakeouts, {
    onError: criticalError,
  });
};

export const useCreateTakeout = (): UseMutateFunction<Takeout> => {
  const criticalError = useCriticalError();
  const client = useQueryClient();
  const { mutate } = useMutation("create_takeout", doCreateTakeout, {
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
    onError: criticalError,
  });
  return mutate;
};

export default useTakeouts;
