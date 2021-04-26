import { Redis } from "ioredis";
import { StaffMember, StaffMemberPresenceStatusEnum } from "../../gen";
import { readYamlFolder } from "../utils/read-yaml-folder";
import path from "path";

const selfMembers: Partial<StaffMember>[] = [];
readYamlFolder("members", path.join(process.cwd(), "data", "members"))
  .filter(
    (member: StaffMember): boolean => Boolean(member) && Boolean(member.id)
  )
  .map((member: StaffMember) => selfMembers.push(member));

/**
 * Closure that fetches the user using a provided redis instance.
 * @param {Redis} redis The provided redis client for the closure
 * @returns {Function} closure The closure used to fetch the user.
 */
export function fetchStaff(
  redis: Redis
): (id: string) => Promise<null | StaffMember> {
  return async function (id: string) {
    const key = `discord:cache:users:${id}`;
    const data = await redis.get(key);
    if (!data) {
      return;
    }

    try {
      const user = JSON.parse(data) as StaffMember;

      return {
        ...completion,
        ...(selfMembers.find(({ id }) => id === user.id) || {}),
        ...user
      };
    } catch {
      return;
    }
  };
}

const completion: StaffMember = {
  avatar: "",
  discriminator: "",
  id: "",
  presence: {
    text: "",
    status: StaffMemberPresenceStatusEnum.Online,
    emote: ""
  },
  role: {
    position: 0,
    name: "",
    color: ""
  },
  socials: [],
  username: ""
};

/**
 * Fetches the list of staff users stored in the redis cache.
 * @param {Redis} redis redis instance containing the cache information.
 */
async function getStaff(redis: Redis): Promise<StaffMember[] | string> {
  const index = await redis.get("discord:cache:index");

  if (index) {
    try {
      const membersIds = JSON.parse(index) as string[];

      if (!Array.isArray(membersIds)) return [];

      const fetcher = fetchStaff(redis);

      return (
        await Promise.all<StaffMember>(
          membersIds.map((element) => fetcher(element))
        )
      ).filter(Boolean);
    } catch {
      return [];
    }
  }
  return [];
}

export default getStaff;
