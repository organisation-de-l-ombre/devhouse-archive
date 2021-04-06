import { MovieHeaders } from "../modules/Headers";
import { GenericSection } from "../sections/GenericSection";
import { CastingSection } from "../sections/Casting";
import { VideosGlobalSection } from "../sections/Videos";
import { OSTSection } from "../sections/OST";

export interface S3DataResponse {
  id: string;
  title: string;
  internationalTitle: string;
  companies: string[];
  releaseDate?: string;
  internationalReleaseDate?: string;
  duration?: string;
  type?: string[];
  publicType?: string;
  headers?: MovieHeaders;
  movie: GenericSection;
  casting?: CastingSection;
  characters?: GenericSection;
  videos: VideosGlobalSection;
  ost?: OSTSection;
  technicalSpecs?: null;
}
