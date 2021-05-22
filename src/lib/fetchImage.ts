const fetchImage = (image: string): string => {
  return `https://imageproxy.developershouse.xyz/${window.screen.width}x,sc,fit/${image}`;
};

export default fetchImage;
