import { readYamlFolder } from "../utils/read-yaml-folder";
import path from "path";
import { fetchStaff } from "./get-staff";
import { Redis } from "ioredis";
import { Project } from "../types/models/Project";
import { StaffMember } from "../types/models/StaffMember";

const selfProjects: Project[] = [];
readYamlFolder<Project>(
  "projects",
  path.join(process.cwd(), "data", "projects")
).map((project: Project) => selfProjects.push(project));

async function getProjects(redis: Redis): Promise<Project[]> {
  const fetcher = fetchStaff(redis);
  return await Promise.all(
    selfProjects.map(async ({ members, managers, ...project }: Project) => ({
      ...project,
      members: (
        await Promise.all(members.map(({ id }) => fetcher(id)))
      ).filter((user) => user !== undefined) as StaffMember[],
      managers: (
        await Promise.all(managers.map(({ id }) => fetcher(id)))
      ).filter((user) => user !== undefined) as StaffMember[]
    }))
  );
}

export default getProjects;
