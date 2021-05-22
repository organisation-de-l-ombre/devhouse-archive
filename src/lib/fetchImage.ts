const fetchImage = (image: string): string => {
  return `https://imageproxy.developershouse.xyz/${window.innerWidth},webp/${image}`;
};

export default fetchImage;
