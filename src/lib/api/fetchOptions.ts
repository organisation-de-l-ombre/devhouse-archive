import { UseQueryOptions } from "react-query";

const fetchOptions: UseQueryOptions = {
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchIntervalInBackground: false,
  refetchOnReconnect: true,
  retry: false,
};

export default fetchOptions as Record<string, unknown>;
