import { CachedUser } from "../pages/Members/types";

export function groupBy<T, TR>(
  array: T[],
  parameter: (value: T) => TR
): Map<TR, T[]> {
  const ret: Map<TR, T[]> = new Map<TR, T[]>();
  array.forEach((value) => {
    const identifier = parameter(value);
    ret.set(identifier, [...(ret.get(identifier) || []), value]);
  });
  return ret;
}

const nameColor = {
  online: "rgb(67, 181, 129)",
  idle: "rgb(250, 166, 26)",
  dnd: "rgb(240, 71, 71)",
  offline: "gray",
  invisible: "gray",
};

export function statusToColor(
  name: "online" | "idle" | "dnd" | "offline" | "invisible"
): string {
  return nameColor[name] || nameColor.offline;
}

export function getAvatar(member: CachedUser): string {
  return member.avatar
    ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.${
        member.avatar.startsWith("a_") ? "gif" : "webp"
      }`
    : `https://cdn.discordapp.com/embed/avatars/${
        parseInt(member.id, 10) % 5
      }.png`;
}
