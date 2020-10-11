import { ServerResponse } from "utilities/types";

export function groupBy<T, TR> (
    array: T[],
    parameter: (value: T) => TR
): Map<TR, T[]> {
    const ret: Map<TR, T[]> = new Map<TR, T[]>();
    array.forEach((value) => {
        const identifier = parameter(value);
        ret.set(identifier, [...(ret.get(identifier) || []), value]);
    });
    return ret;
};

const nameColor = {
    online: "rgb(67, 181, 129)",
    idle: "rgb(250, 166, 26)",
    dnd: "rgb(240, 71, 71)",
    offline: "gray"
};

export function statusToColor (
    name: "online" | "idle" | "dnd" | "offline"
): string {
    return nameColor[name] || nameColor.offline;
};

export function getAvatar (member: { user: { avatar: string; id: string; discriminator: string; } }): string {
    return member.user.avatar
        ? `https://cdn.discordapp.com/avatars/${member.user.id}/${
            member.user.avatar
        }.${member.user.avatar.startsWith("a_") ? "gif" : "png"}`
        : `https://cdn.discordapp.com/embed/avatars/${
            parseInt(member.user.discriminator) % 5
        }.png`;
};

export const sum = (a: number, b: number) => {
    if ('development' === process.env.NODE_ENV) {
        console.log('boop');
    }
    return a + b;
};


export function returnOrThrow<T> (response: ServerResponse<T>): ServerResponse<T> {
    if (response.code === 200) {
        return response;
    }
    throw new Error(`Failed to load the members ${response.message}`);
}