import { Image } from "@components/modules";
import { calculatePosterDimensions, PosterDimensions } from "@lib/movieTitle";
import { fetchImage } from "@lib/utils";
import { MovieTitleComponent } from "@typings/movieTitle";
import React, { useMemo } from "react";

const Poster: MovieTitleComponent = ({
  dataResponse: { localizedInformation },
}) => {
  const { width, height } = useMemo<PosterDimensions>(
    () => calculatePosterDimensions(),
    []
  );

  return (
    <Image
      withBackground
      withBorderRadius
      withBoxShadow
      placeholder={fetchImage({
        image: localizedInformation.poster as string,
        width: Math.ceil(width / 5),
        height: Math.ceil(height / 5),
        format: "webp",
      })}
      image={fetchImage({
        image: localizedInformation.poster as string,
        width,
        height,
        format: "webp",
      })}
      alt={localizedInformation.title}
      width={width}
      height={height}
      css={{ margin: "4rem 2rem 0 0" }}
    />
  );
};

export default Poster;
