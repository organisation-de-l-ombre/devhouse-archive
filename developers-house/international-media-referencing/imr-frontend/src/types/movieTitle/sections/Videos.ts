import { SummaryObject } from "../global/Summary";

interface VideosSection {
  name: string;
  id: string;
  videos: VideoObject[];
}
interface VideoObject {
  title: string;
  videoID: string;
}

interface VideosGlobalSection {
  summary: SummaryObject[];
  videos: VideosSection[];
}

export { VideosSection, VideoObject, VideosGlobalSection };
