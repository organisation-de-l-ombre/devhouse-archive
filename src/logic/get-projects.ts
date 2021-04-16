import { Projects } from "../../gen";
import { readYamlFolder } from "../utils/read-yaml-folder";
import path from "path";
import { fetchStaff } from "./get-staff";
import { Redis } from "ioredis";

const selfProjects: Projects[] = [];
void readYamlFolder<Projects>(
  path.join(process.cwd(), "data", "projects")
).then((a) => selfProjects.push(...a));

async function getProjects(redis: Redis): Promise<Projects[]> {
  const fetcher = fetchStaff(redis);
  return await Promise.all(
    selfProjects.map(async ({ members, managers, ...project }) => ({
      ...project,
      members: members
        ? (await Promise.all(members.map(({ id }) => fetcher(id)))).filter(
            Boolean
          )
        : [],
      managers: managers
        ? (await Promise.all(managers.map(({ id }) => fetcher(id)))).filter(
            Boolean
          )
        : [],
    }))
  );
}

export default getProjects;
