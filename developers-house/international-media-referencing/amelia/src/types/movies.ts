interface MovieDataRequest {
  request: "movie-data";
  id: string;
  language: string;
}

export type MovieRequest = MovieDataRequest;
