interface FetchImageBackground {
  type: "background";
  image: string;
}

interface FetchImage {
  type: "image";
  width: string;
  height: string;
  image: string;
}

type FetchImageOptions = FetchImageBackground | FetchImage;

const fetchImage = (options: FetchImageOptions): string => {
  switch (options.type) {
    case "background":
      return `https://imageproxy.developershouse.xyz/${window.innerWidth},jpg/${options.image}`;

    case "image":
      return `https://imageproxy.developershouse.xyz/${options.width}x${options.height},jpg/${options.image}`;

    default:
      return "";
  }
};

export default fetchImage;
