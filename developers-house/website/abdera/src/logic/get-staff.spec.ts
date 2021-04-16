import getStaff, { fetchStaff } from "./get-staff";
import Redis from "ioredis-mock";
import { StaffMember, StaffMemberPresenceStatusEnum } from "../../gen";

const user: StaffMember = {
  avatar: "",
  discriminator: "",
  id: "",
  presence: {
    emote: "",
    text: "",
    status: StaffMemberPresenceStatusEnum.Online,
  },
  socials: [],
  role: {
    name: "",
    position: 0,
    color: "",
  },
  username: "",
};

const mockRedis = new Redis({
  data: {
    "discord:cache:index": JSON.stringify(["_user"]),
    "discord:cache:users:_user": JSON.stringify(user),
    "discord:cache:users:invalid": "hey",
  },
});

describe("fetchStaff(redis)", () => {
  const fetcher = fetchStaff(mockRedis);
  it("Fetched a specific user", () => {
    void expect(fetcher("_user")).resolves.toMatchSnapshot();
  });
  it("Returned null if the user doesn't exists in the cache", () => {
    void expect(fetcher("not_existent")).resolves.toBeFalsy();
  });
  it("Returned null if the user isn't valid", () => {
    void expect(fetcher("invalid")).resolves.toBeFalsy();
  });
});

describe("getStaff(redis)", () => {
  it("Fetched a list of correct users", () => {
    mockRedis.set("discord:cache:index", JSON.stringify(["_user"]));
    void expect(getStaff(mockRedis)).resolves.toMatchSnapshot();
  });

  it("Returns an empty array if the index doesn't exists", () => {
    mockRedis.del("discord:cache:index");
    void expect(getStaff(mockRedis)).resolves.toMatchSnapshot();
  });
  it("Ignores the invalid users", () => {
    mockRedis.set("discord:cache:index", JSON.stringify(["invalid"]));
    void expect(getStaff(mockRedis)).resolves.toMatchSnapshot();
  });

  it("Returns an empty array if the index is invalid", () => {
    mockRedis.set("discord:cache:index", JSON.stringify("hey"));
    void expect(getStaff(mockRedis)).resolves.toStrictEqual([]);
  });
});
