import getStaff, { fetchStaff } from "./get-staff";
import Redis from "ioredis-mock";
import {StaffMember, StaffMemberPresenceStatusEnum} from "../../gen";

const user: StaffMember = {
    avatar: "",
    discriminator: "",
    id: "",
    presence: {
        emote: "",
        text: "",
        status: StaffMemberPresenceStatusEnum.Online,
    },
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
        "discord:cache:user:_user": JSON.stringify(user),
        "discord:cache:user:invalid": "hey",
    },
});

describe("fetchStaff(redis)", () => {
    const fetcher = fetchStaff(mockRedis);
    it ("Fetched a specific user", () => {
        expect(fetcher("_user"))
            .resolves.toStrictEqual(user);
    });
    it ("Returned null if the user doesn't exists in the cache", () => {
        expect(fetcher("not_existent")).resolves.toStrictEqual(null);
    });
    it ("Returned null if the user isn't valid", () => {
        expect(fetcher("invalid")).resolves.toStrictEqual(null);
    });
});

describe("getStaff(redis)", () => {
   it ("Fetched a list of correct users", () => {
       expect(getStaff(mockRedis)).resolves.toStrictEqual([user]);
   });
   mockRedis.del("discord:cache:index");

   it ("Returns an empty array if the index doesn't exists", () => {
       expect(getStaff(mockRedis)).resolves.toStrictEqual(null);
   });
   mockRedis.set("discord:cache:index", JSON.stringify(["invalid"]))
   it ("Ignores the invalid users", () => {
       expect(getStaff(mockRedis)).resolves.toStrictEqual([]);
   });

    mockRedis.set("discord:cache:index", JSON.stringify("hey"))
   it ("Returns an empty array if the index is invalid", () => {
       expect(getStaff(mockRedis)).resolves.toStrictEqual([]);
   });
});