export interface RootResponse {
  statusCode: number;
  id: string;
  title: string;
  data: {
    headers: string;
    movie: string;
    casting?: string;
    characters?: string;
    videos?: string;
    ost?: string;
    "technical-specs"?: string;
  };
}
