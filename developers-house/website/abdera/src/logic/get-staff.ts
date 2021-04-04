import { Redis } from "ioredis";
import {StaffMember} from "../../gen";
import { readYamlFolder } from "../utils/read-yaml-folder";
import { join } from "path";

const selfMembers: Partial<StaffMember>[] = [];
readYamlFolder<Partial<StaffMember>>(join(process.cwd(), "data", "members"))
    .then((e) => e.filter((a) => Boolean(a) && a.id))
    .then((a) => selfMembers.push(...a));
/**
 * Closure that fetches the user using a provided redis instance.
 * @param {Redis} redis The provided redis client for the closure
 * @returns {Function} closure The closure used to fetch the user.
 */
export function fetchStaff (redis: Redis): (id: string) => Promise<(null | StaffMember)> {
    return async function (id: string) {
        const key = `discord:cache:users:${id}`;
        const data = await redis.get(key);
        if (!data) return null;

        try {
            console.log(data);
            return JSON.parse(data);
        } catch (e) {
            return null;
        }
    }
}

/**
 * Fetches the list of staff users stored in the redis cache.
 * @param {Redis} redis redis instance containing the cache information.
 */
async function getStaff(redis: Redis): Promise<StaffMember[] | string> {
    const index = await redis.get('discord:cache:index');
    if (index) {
        try {
            const membersIds: string[] = JSON.parse(index);
            if (!Array.isArray(membersIds)) return [];
            const fetcher = fetchStaff(redis);
            return (await Promise.all<StaffMember>(membersIds.map(fetcher)))
                .filter(Boolean)
                .map((user) => ({ ...user, ...(selfMembers
                        .filter(({ id }) => id === user.id)[0] || {}) }));
        } catch (e) {
            return [];
        }
    }
    return [];
}

export default getStaff;