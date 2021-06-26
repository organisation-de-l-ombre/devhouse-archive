import { QueryObserverResult, useQuery, UseQueryOptions } from "react-query";
import { Projects } from "@developers-house/abdera";
import { usePreload } from "@components/PreloadContext/PreloadContext";
import fetch from "cross-fetch";
import { DisplayAPIClient } from "../constants";

const useProjects = (
  options?: UseQueryOptions<Projects[], Error>
): QueryObserverResult<Projects[], Error> => {
  usePreload((queryClient) =>
    queryClient.prefetchQuery(
      "developers-house/projects",
      () => DisplayAPIClient.dataProjectsGet(),
      options
    )
  );

  return useQuery(
    "developers-house/projects",
    () => DisplayAPIClient.dataProjectsGet(),
    options
  );
};

type ProjectWithMarkdown = Projects & { markdown: string };
const fetchProjectMarkdown = async (
  projectId: string
): Promise<ProjectWithMarkdown> => {
  const projects =
    (await DisplayAPIClient.dataProjectsGet()) as ProjectWithMarkdown[];
  const project = projects.find(
    (searching) => searching.normalizedName === projectId
  );
  if (!project) {
    throw new Error("No such project");
  }
  if (project.markdownS3) {
    project.markdown = await fetch(
      project.markdownS3.replace(
        /(s3\.developershouse\.xyz|cdn\.developershouse\.xyz)/g,
        typeof window === "undefined"
          ? "minio.minio.svc.cluster.local"
          : "cdn.developershouse.xyz"
      )
    ).then((response) => response.text());
  }
  return project;
};

export const useProjectsWithMarkdown = (
  projectId: string,
  options?: UseQueryOptions<ProjectWithMarkdown, Error>
): QueryObserverResult<ProjectWithMarkdown, Error> => {
  usePreload((queryClient) =>
    queryClient.prefetchQuery(
      ["developers-house/projects", projectId],
      () => fetchProjectMarkdown(projectId),
      options
    )
  );

  return useQuery(
    ["developers-house/projects", projectId],
    () => fetchProjectMarkdown(projectId),
    options
  );
};

export default useProjects;
