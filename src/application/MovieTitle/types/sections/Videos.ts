import { SummaryObject } from "../global/Summary";

interface TrailersSection {
  name: string;
  id: string;
  videos: TrailerObject[];
}
interface VideosSection {
  name: string;
  id: string;
  videos: VideoObject[];
}
interface VideoObject {
  title: string;
  videoID: string;
}

type TrailerObject = VideoObject & { main: boolean };

interface VideosGlobalSection {
  summary: SummaryObject[];
  trailers?: TrailersSection;
  videos?: VideosSection[];
}

export {
  TrailersSection,
  VideosSection,
  VideoObject,
  TrailerObject,
  VideosGlobalSection,
};
