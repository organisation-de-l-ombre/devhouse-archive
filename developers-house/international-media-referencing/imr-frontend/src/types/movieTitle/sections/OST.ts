import { SummaryObject } from "../global/Summary";

interface StreamingObject {
  service: string;
  album: string;
}
interface AlbumSection {
  name: string;
  id: string;
  albumName: string;
  coverURL?: string;
  interpreters: string[];
  streaming: StreamingObject[];
}
interface TrackInformationObject {
  title: string;
  VOTitle?: string;
  duration: string;
  timecode?: string;
  description?: string;
  characters?: string[];
  videoID?: string;
  lyrics?: string;
}
interface TracksSection {
  name: string;
  id: string;
  tracks: TrackInformationObject[];
}
interface OSTSection {
  summary: SummaryObject[];
  album?: AlbumSection;
  body: TracksSection[];
}

export { StreamingObject, TrackInformationObject, TracksSection, OSTSection };
