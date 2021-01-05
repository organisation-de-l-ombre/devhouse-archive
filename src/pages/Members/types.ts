export interface CachedUser {
  username: string;
  nickname?: string;
  presence?: {
    emote?: string;
    status: "online" | "dnd" | "offline" | "idle" | "invisible";
    presenceText?: string;
  };
  hoistRole: {
    position: number;
    color: string;
    name: string;
  };
  connexions: {
    name: string;
    link: string;
  }[];
  avatar?: string;
  discriminator: string;
  id: string;
}
