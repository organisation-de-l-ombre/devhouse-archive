interface VideoObject {
  title: string;
  videoID: string;
}

type TrailerObject = VideoObject & { main: boolean };

interface UniverseObject {
  title: string;
  id: string;
  text: string;
}
interface StreamingObject {
  service: string;
  album: string;
}
interface SongInformationObject {
  title: string;
  VOTitle: string;
  timecode: string;
  description: string;
  characters: string[];
  videoID: string;
  lyrics: string;
}
interface MusicInformationObject {
  title: string;
  VOTitle: string;
  timecode: string;
  description: string;
}

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
    presentation: string[];
    detailledSummary: string[];
    reviews: string;
    references: string[];
    universe: UniverseObject[];
    distinctions: string[];
  };
  videos: {
    trailers: TrailerObject[];
    songs: VideoObject[];
    extracts: VideoObject[];
    extras: VideoObject[];
  };
  ost: {
    streaming: StreamingObject[];
    songs: SongInformationObject[];
    music: MusicInformationObject[];
  };
}

export {
  MovieObject,
  VideoObject,
  TrailerObject,
  UniverseObject,
  StreamingObject,
  SongInformationObject,
  MusicInformationObject,
};
