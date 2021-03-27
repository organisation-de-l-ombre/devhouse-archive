import { Redis } from "ioredis";
import { StaffMember } from "../../gen";

/**
 * Closure that fetches the user using a provided redis instance.
 * @param {Redis} redis The provided redis client for the closure
 * @returns {Function} closure The closure used to fetch the user.
 */
function fetchStaff (redis: Redis): (id: string) => Promise<(null | StaffMember)> {
    return async function (id: string) {
        const key = `discord:cache:users:${id}`;
        const data = await redis.get(key);
        if (!data) return null;

        try {
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
async function getStaff(redis: Redis): Promise<StaffMember[]> {
    const index = await redis.get('discord:cache:index');
    if (index) {
        try {
            const membersIds: string[] = JSON.parse(index);
            if (!Array.isArray(membersIds)) return null;
            const fetcher = fetchStaff(redis);
            return (await Promise.all<StaffMember>(membersIds.map(fetcher)))
                .filter(Boolean);
        } catch (e) { return null; }
    }
}

export default getStaff;