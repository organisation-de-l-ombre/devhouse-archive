// Serves movie background in function of device resolution
const calculateBackgroundSize = (): "normal" | "large" | "small" => {
  if (typeof window === "undefined") {
    return "normal";
  }

  const screenWidth = window.outerWidth;

  if (screenWidth > 1920) {
    return "large";
  }

  if (screenWidth < 400) {
    return "small";
  }

  return "normal";
};

// Calculates appropriate movie poster size
interface PosterDimensions {
  width: number;
  height: number;
}

const calculatePosterDimensions = (): PosterDimensions => {
  if (typeof window === "undefined") {
    return {
      width: 270,
      height: 400,
    };
  }

  const initialWidth = 270;
  const initialHeight = 400;
  const ratio = 270 / 400;

  if (window.innerWidth > 400) {
    return { width: initialWidth, height: initialHeight };
  }

  const width = Math.ceil((50 / 100) * window.innerWidth);

  return {
    width,
    height: Math.ceil(width * (1 / ratio)),
  };
};

export { calculateBackgroundSize, calculatePosterDimensions };
