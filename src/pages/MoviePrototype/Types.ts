interface MovieObject {
  name: string;
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
  trailers: {
    [key: string]: Array<{ name: string; videoID: string }>;
  };
  movie: {
    presentation: string[];
    detailledSummary: string[];
    reviews: string;
    references: string[];
  };
}
interface VideoObject {
  title: string;
  videoID: string;
}

type TrailerObject = VideoObject & { main: boolean };

export { MovieObject, VideoObject, TrailerObject };
