import { QueryObserverResult, useQuery, UseQueryOptions } from "react-query";
import { Projects } from "@developers-house/abdera";
import { DisplayAPIClient } from "../constants";

const useProjects = (
  options?: UseQueryOptions<Projects[], Error>
): QueryObserverResult<Projects[], Error> => {
  return useQuery(
    "projectsCache",
    () => DisplayAPIClient.dataProjectsGet(),
    options
  );
};

export default useProjects;
