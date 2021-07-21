import { useMovieTitleSection } from "@hooks/useMovieTitle";
import { MovieTitleComponent, WatchModule } from "@typings/movieTitle";
import React from "react";
import { FlexContainer } from "@components/ui";
import loadable from "@loadable/component";
import { fetchImage } from "@lib/utils";
import { calculatePosterDimensions } from "@lib/movieTitle";
import { css } from "@emotion/react";
import Background from "../Background/Background";
import HandleData from "../HandleData/HandleData";
import styles from "../../Headers.module.scss";

const ImageComponent = loadable(
  () => import("@components/modules/Image/Image")
);

const Watch: MovieTitleComponent = ({ dataResponse }) => {
  const data = useMovieTitleSection<WatchModule>(dataResponse.id, "watch");

  if (!data) {
    return null;
  }

  if (data.sectionStatus === "loading" || data.sectionStatus === "error") {
    return <HandleData dataResponse={data} />;
  }

  const { localizedInformation } = dataResponse;
  const { width, height } = calculatePosterDimensions();

  return (
    <FlexContainer
      horizontallyCentered
      widthFull
      heightFull
      css={{ position: "fixed" }}
    >
      <Background dataResponse={dataResponse} />
      <FlexContainer
        pageBodyWidth
        allowWrap
        css={{ height: "calc(100% - 8rem)", zIndex: 1 }}
        className={styles.headers}
      >
        {localizedInformation.poster && (
          <ImageComponent
            withBackground
            withBorderRadius
            withBoxShadow
            placeholder={fetchImage({
              image: localizedInformation.poster,
              width: Math.ceil(width / 5),
              height: Math.ceil(height / 5),
              format: "webp",
            })}
            image={fetchImage({
              image: localizedInformation.poster,
              width,
              height,
              format: "webp",
            })}
            alt={localizedInformation.title}
            width={width}
            height={height}
            className={styles["movie-poster"]}
          />
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Watch;
