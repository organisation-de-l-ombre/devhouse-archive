import React, { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import detectMobileDevice from "@lib/detectMobileDevice";
import useLanguage from "@hooks/useLanguage";
import {
  FlexContainer,
  ButtonLink,
  Button,
  ButtonsGroup,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import fetchImage from "@lib/fetchImage";
import { css } from "@emotion/react";
import loadable from "@loadable/component";
import { useLocation } from "react-router";
import { MovieTitleComponent } from "@typings/movieTitle";
import styles from "./Headers.module.scss";
import containerStyle from "../../Containers.module.scss";

const YouTubePlayer = loadable(
  () => import("@components/ui/YouTubePlayer/YouTubePlayer")
);
const ImageComponent = loadable(
  () => import("@components/modules/Image/Image")
);

interface BackgroundDimensions {
  backgroundWidth?: number;
  backgroundHeight?: number;
}

interface PosterDimensions {
  posterWidth: number;
  posterHeight: number;
}

const calculateBackgroundDimensions = (): BackgroundDimensions => {
  if (typeof window === "undefined") {
    return {
      backgroundWidth: 1920,
      backgroundHeight: 1080,
    };
  }

  const screenWidth = window.outerWidth;
  const screenHeight = window.outerHeight;

  if (screenWidth > 3840 && screenHeight > 2160) {
    return {
      backgroundWidth: 3840,
      backgroundHeight: 2160,
    };
  }

  return {
    backgroundWidth: screenWidth,
    backgroundHeight: screenHeight,
  };
};

const calculatePosterDimensions = (): PosterDimensions => {
  if (typeof window === "undefined") {
    return {
      posterWidth: 270,
      posterHeight: 400,
    };
  }

  const initialWidth = 270;
  const initialHeight = 400;
  const ratio = 270 / 400;

  if (window.innerWidth > 400) {
    return { posterWidth: initialWidth, posterHeight: initialHeight };
  }

  const posterWidth = Math.ceil((50 / 100) * window.innerWidth);

  return {
    posterWidth,
    posterHeight: Math.ceil(posterWidth * (1 / ratio)),
  };
};

const Headers: MovieTitleComponent = ({ dataResponse }) => {
  const { localizedInformation } = dataResponse;
  const { language } = useLanguage();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [trailerWindowOpen, setTrailerWindowOpen] = useState<boolean>(
    queryParams.get("focus") === "trailer" || false
  );
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");
  const { t: tTags } = useTranslation("media\\media");
  const [backgroundLoaded, setBackgoundLoaded] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<boolean>(false);
  const { backgroundWidth, backgroundHeight } = calculateBackgroundDimensions();
  const { posterWidth, posterHeight } = calculatePosterDimensions();

  let background;

  if (localizedInformation.background && typeof window !== "undefined") {
    background = new Image();
    background.src = fetchImage({
      type: "background",
      width: backgroundWidth,
      height: backgroundHeight,
      image: localizedInformation.background,
    });
    background.onerror = (): void => {
      setBackgoundLoaded(true);
      setBackgroundError(true);
    };
    background.onload = (): void => {
      setBackgoundLoaded(true);
    };
  }

  return (
    <>
      {localizedInformation.trailer && typeof window !== "undefined" && (
        <YouTubePlayer
          title={`${localizedInformation.title} - ${t(
            "headers.trailerWindowTitle"
          )}`}
          videoID={localizedInformation.trailer}
          autoPlay
          open={trailerWindowOpen}
          setOpen={setTrailerWindowOpen}
          autoClose
        />
      )}
      <FlexContainer
        horizontallyCentered
        className={styles["headers-background"]}
      >
        {background ? (
          <div
            css={css`
              width: 100%;
              height: 100%;
              position: absolute;
              background-image: url("${background.src}");
              background-size: cover;
              background-repeat: no-repeat;
              background-position-x: center;
              opacity: 0;
              ${backgroundLoaded &&
              `
                background-color: var(--media-headers-primary-background-color);
                opacity: ${
                  backgroundError
                    ? "0.6"
                    : "var(--media-headers-background-opacity)"
                };
              `}
              ${!backgroundLoaded && "filter: blur(5px);"}
              transition: background-color 0.5s, opacity 0.5s, filter 0.5s;
            `}
          />
        ) : (
          <div
            css={css`
              width: 100%;
              height: 100%;
              position: absolute;
              background-color: var(--media-headers-primary-background-color);
              opacity: ${typeof window === "undefined" ? "0" : "0.6"};
            `}
          />
        )}
        <FlexContainer pageBodyWidth allowWrap className={styles.headers}>
          {localizedInformation.poster && (
            <ImageComponent
              withBackground
              withBorderRadius
              withBoxShadow
              placeholder={fetchImage({
                type: "image",
                image: localizedInformation.poster,
                width: Math.ceil(posterWidth / 5),
                height: Math.ceil(posterHeight / 5),
              })}
              image={fetchImage({
                type: "image",
                image: localizedInformation.poster,
                width: posterWidth,
                height: posterHeight,
              })}
              alt={localizedInformation.title}
              width={posterWidth}
              height={posterHeight}
              className={styles["movie-poster"]}
            />
          )}
          <FlexContainer column className={styles["headers-content"]}>
            <h1>{`${localizedInformation.title} (${dataResponse.title})`}</h1>
            <h2>{dataResponse.companies.join(", ")}</h2>
            {localizedInformation.releaseDate && (
              <h2>
                {new Intl.DateTimeFormat(language).format(
                  new Date(localizedInformation.releaseDate)
                )}
                {dataResponse.duration ? ` • ${dataResponse.duration}` : ""}
                {
                  /* eslint-disable-next-line no-underscore-dangle */
                  dataResponse._case
                }
              </h2>
            )}
            {localizedInformation.description && (
              <p>
                <q className={containerStyle.quotes}>
                  {localizedInformation.description}
                </q>
              </p>
            )}
            {localizedInformation.quotation && (
              <p>
                <q className={containerStyle.quotes}>
                  {localizedInformation.quotation}
                </q>
              </p>
            )}
            {dataResponse.tags && (
              <ButtonsGroup minimal>
                {dataResponse.tags.map((tag: string): React.ReactElement => {
                  return (
                    <ButtonLink key={tag} to={`/browse?tag=${tag}`}>
                      <Trans t={tTags} i18nKey={`tags.${tag}`} />
                    </ButtonLink>
                  );
                })}
              </ButtonsGroup>
            )}
            <ButtonsGroup minimal>
              <Button>
                <MdMovie />
                <span>
                  <Trans t={t} i18nKey="headers.buttons.watch" />
                </span>
              </Button>
              {localizedInformation.trailer && (
                <Button
                  onClick={() => {
                    const isMobileDevice: boolean = detectMobileDevice();

                    if (isMobileDevice) {
                      window.open(
                        `https://www.youtube.com/watch?v=${localizedInformation.trailer}`
                      );
                    } else {
                      setTrailerWindowOpen(!trailerWindowOpen);
                    }
                  }}
                >
                  <FaPlay />
                  <span>
                    <Trans t={t} i18nKey="headers.buttons.trailer" />
                  </span>
                </Button>
              )}
            </ButtonsGroup>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default Headers;
