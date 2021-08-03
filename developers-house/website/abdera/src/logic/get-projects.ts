import { Project } from "../../gen";
import { readYamlFolder } from "../utils/read-yaml-folder";
import path from "path";
import { fetchStaff } from "./get-staff";
import { Redis } from "ioredis";

const selfProjects: Project[] = [];
readYamlFolder<Project>(
  "projects",
  path.join(process.cwd(), "data", "projects")
).map((project: Project) => selfProjects.push(project));

async function getProjects(redis: Redis): Promise<Project[]> {
  const fetcher = fetchStaff(redis);
  return await Promise.all<Project>(
    selfProjects.map(async ({ members, managers, ...project }: Project) => ({
      ...project,
      members: members
        ? (
            await Promise.all(members.map(({ id }) => fetcher(id)))
          ).filter(Boolean)
        : [],
      managers: managers
        ? (
            await Promise.all(managers.map(({ id }) => fetcher(id)))
          ).filter(Boolean)
        : []
    }))
  );
}

export default getProjects;
