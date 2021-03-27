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
import { useCriticalError } from "./useAuthorizedApps";
import { Takeout } from "../api/gen";
import { UserAPI } from "../Root";

const useTakeouts = (): QueryObserverResult<Takeout[], Error> => {
  return useQuery("membersCache", () => UserAPI.selfTakeoutsGet());
};

const useCreateTakeout = (): UseMutateFunction<Takeout, Error> => {
  const criticalError = useCriticalError();
  const client = useQueryClient();
  const { mutate } = useMutation(
    "create_takeout",
    () => UserAPI.selfTakeoutsPost(),
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
      onError: (error: Error) => criticalError(error) && undefined,
    }
  );

  return mutate;
};

export { useTakeouts, useCreateTakeout };
