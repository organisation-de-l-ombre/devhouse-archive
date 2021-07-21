interface Service {
  service: string;
  link: string;
}

export interface WatchModule {
  streaming?: Service[];
  vod?: Service[];
}
