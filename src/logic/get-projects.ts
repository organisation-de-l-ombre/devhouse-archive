import { Projects } from "../../gen";
import { readYamlFolder } from "../utils/read-yaml-folder";
import { join } from "path";
import { fetchStaff } from "./get-staff";
import { Redis } from "ioredis";

const selfProjects: Projects[] = [];
readYamlFolder<Projects>(join(process.cwd(), "data", "projects"))
    .then(selfProjects.push.bind(selfProjects));

async function getProjects (redis: Redis): Promise<Projects[]> {
    const fetcher = fetchStaff(redis);
    return await Promise.all(selfProjects
        .map(async (project) => ({
            ...project,
            members: await Promise.all(project.members.map(({ id }) => fetcher(id)).filter(Boolean)),
            managers: await Promise.all(project.members.map(({ id }) => fetcher(id)).filter(Boolean)),
        })));
}

export default getProjects;