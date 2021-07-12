import { SummaryObject } from "../global/Summary";
import { BodyContent } from "../global/GenericSectionBody";

export interface GenericSection {
  summary: SummaryObject[];
  body: BodyContent[];
}
