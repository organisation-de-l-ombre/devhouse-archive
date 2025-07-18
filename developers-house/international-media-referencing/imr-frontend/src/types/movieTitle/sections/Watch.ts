interface WatchService {
  service: string;
  link: string;
}

interface WatchSection {
  streaming?: WatchService[];
  vod?: WatchService[];
}

export { WatchService, WatchSection };
