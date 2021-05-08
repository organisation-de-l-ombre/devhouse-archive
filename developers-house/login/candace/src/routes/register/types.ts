import { GeneralUser } from "../../providers/types";

export interface RegisterSession {
  challenge: string;
  user: GeneralUser;
}
