/*
 * The types for the User's api.
 * Returned by the api.
 */

type UserStatus = "offline" | "online" | "dnd" | "idle";

/*
 * The Basic object for a API User (basic information)
 */
type User = {
  /* The roles of the user (BitFlags) */
  role: string;
  username: string;
  discord: string;
};

type DiscordUserInState = {
  avatar: string;
  discriminator: string;
  username: string;
  nickname: string;
  status: UserStatus;
  statusText: string;
};

type ProjectMember = {
  description: string;
  userState: DiscordUserInState;
  socialNetworks: { name: string; icon: string }[];
} & User;

export type { User, UserStatus, ProjectMember };
