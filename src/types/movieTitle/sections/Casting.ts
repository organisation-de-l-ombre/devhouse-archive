import { SummaryObject } from "../global/Summary";

interface CharacterObject {
  imageURL?: string;
  name: string;
  role: string;
}
interface CastingObject {
  name: string;
  id: string;
  items: CharacterObject[];
}
interface CastingSection {
  summary: SummaryObject[];
  body: CastingObject[];
}

export { CharacterObject, CastingObject, CastingSection };
