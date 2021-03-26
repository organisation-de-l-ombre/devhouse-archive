// Global
interface SummaryItemObject {
  type: "item";
  to: string;
  name: string;
}
interface SummarySubItemsObject {
  type: "subitem";
  to: string;
  name: string;
  items: SummaryItemObject[];
}

type SummaryObject = SummaryItemObject | SummarySubItemsObject;

// Headers section
type TrailerObject = VideoObject & { main: boolean };

interface Text {
  type: "text";
  name: string;
  id: string;
  text: string;
}
interface TextList {
  type: "textlist";
  name: string;
  id: string;
  texts: string[];
}
interface List {
  type: "list";
  name: string;
  id: string;
  items: string[];
}

type BodyContent = Text | TextList | List | SubSection;

interface SubSection {
  type: "subsection";
  name: string;
  id: string;
  body: BodyContent[];
}

// Casting section
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

// Videos sections
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

// OST section
interface StreamingObject {
  service: string;
  album: string;
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
interface OSTBody {
  name: string;
  id: string;
  tracks: TrackInformationObject[];
}

// Final object
interface MovieObject {
  title: string;
  internalTitle: string;
  company: string;
  releaseDate: string;
  duration: string;
  type: string[];
  publicType: string;
  headers: {
    backgroundImage: string;
    moviePoster: string;
    synopsis: string;
    quotation: string;
  };
  movie: {
    summary: SummaryObject[];
    body: BodyContent[];
  };
  casting: {
    summary: SummaryObject[];
    body: CastingObject[];
  };
  characters: {
    summary: SummaryObject[];
    body: BodyContent[];
  };
  videos: {
    summary: SummaryObject[];
    trailers: TrailersSection;
    body: VideosSection[];
  };
  ost: {
    summary: SummaryObject[];
    album: {
      name: string;
      id: string;
      albumName: string;
      coverURL: string;
      interpreters: string[];
      streaming: StreamingObject[];
    };
    body: OSTBody[];
  };
}

export {
  MovieObject,
  VideoObject,
  TrailerObject,
  StreamingObject,
  CharacterObject,
  CastingObject,
  SummaryObject,
  BodyContent,
  SubSection,
  VideosSection,
  TrackInformationObject,
  OSTBody,
};
