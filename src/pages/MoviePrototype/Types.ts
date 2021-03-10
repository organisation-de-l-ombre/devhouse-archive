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
  };
  trailers: {
    [key: string]: Array<{ name: string; videoID: string }>;
  };
}
interface TrailerObject {
  title: string;
  videoID: string;
  main: boolean;
}

export { MovieObject, TrailerObject };
