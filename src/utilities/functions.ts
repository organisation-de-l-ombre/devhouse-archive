import { ServerResponse } from "utilities/types";
import { CachedUser } from "../pages/Members/Members";

/**
 * @param array
 * @param parameter
 */
export function groupBy<T, TR>(
  array: T[],
  parameter: (value: T) => TR
): Map<TR, T[]> {
  const returnValue: Map<TR, T[]> = new Map<TR, T[]>();
  array.forEach((value) => {
    const identifier = parameter(value);
    returnValue.set(identifier, [
      ...(returnValue.get(identifier) || []),
      value
    ]);
  });
  return returnValue;
}

const nameColor = {
  online: "rgb(67, 181, 129)",
  idle: "rgb(250, 166, 26)",
  dnd: "rgb(240, 71, 71)",
  offline: "gray",
  invisible: "gray"
};

/**
 * @param name
 */
export function statusToColor(
  name: "online" | "idle" | "dnd" | "offline" | "invisible"
): string {
  return nameColor[name] || nameColor.offline;
}

/**
 * @param member
 */
export function getAvatar(member: CachedUser): string {
  return member.avatar
    ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.${
        member.avatar.startsWith("a_") ? "gif" : "webp"
      }`
    : `https://cdn.discordapp.com/embed/avatars/${
        Number.parseInt(member.id) % 5
      }.png`;
}

/**
 * @param response
 */
export function returnOrThrow<T>(
  response: ServerResponse<T>
): ServerResponse<T> {
  if (response.code === 200) {
    return response;
  }
  throw new Error(`Failed to load the members ${response.message}`);
}
