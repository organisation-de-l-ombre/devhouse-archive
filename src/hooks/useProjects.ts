import { QueryObserverResult, useQuery, UseQueryOptions } from "react-query";
import { Projects } from "@developers-house/abdera";
import { usePreload } from "@components/PreloadContext/PreloadContext";
import { DisplayAPIClient } from "../constants";

const useProjects = (
  options?: UseQueryOptions<Projects[], Error>
): QueryObserverResult<Projects[], Error> => {
  usePreload((queryClient) =>
    queryClient.prefetchQuery("developers-house/projects", () =>
      DisplayAPIClient.dataProjectsGet()
    )
  );

  return useQuery(
    "developers-house/projects",
    () => DisplayAPIClient.dataProjectsGet(),
    options
  );
};

export default useProjects;
