interface FetchBackground {
  type: "background";
  width?: number;
  height?: number;
  image: string;
}

interface FetchImage {
  type: "image";
  width: number;
  height: number;
  image: string;
}

type FetchImageOptions = FetchBackground | FetchImage;

const fetchImage = (options: FetchImageOptions): string => {
  switch (options.type) {
    case "background": {
      const params = new URLSearchParams({
        width: options.width ? options.width.toString() : "",
        height: options.height ? options.height.toString() : "",
      });

      return `https://imageproxy.developershouse.xyz/${options.image}${
        options.width || options.height ? `?${params.toString()}` : ""
      }`;
    }

    case "image":
      return `https://imageproxy.developershouse.xyz/${options.image}?width=${options.width}&height=${options.height}`;

    default:
      return "";
  }
};

export default fetchImage;
