import React, { lazy, useState } from "react";
import { FaPlay, MdMovie } from "react-icons/all";
import detectMobileDevice from "@lib/detectMobileDevice";
import useLanguage from "@hooks/useLanguage";
import {
  FlexContainer,
  ButtonLink,
  Button,
  ButtonsGroup,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { useQuery, UseQueryResult } from "react-query";
import fetchOptions from "@lib/api/fetchOptions";
import { SuspenseComponent } from "@components/modules";
import fetchImage from "@lib/fetchImage";
import { css } from "@emotion/react";
import styles from "./Headers.module.scss";
import containerStyle from "../../Containers.module.scss";
import { ReactMovieElement, MovieHeadersSection } from "../../types";

const YouTubePlayer = lazy(
  () => import("@components/ui/YouTubePlayer/YouTubePlayer")
);
const ImageComponent = lazy(() => import("@components/modules/Image/Image"));

interface BackgroundDimensions {
  backgroundWidth?: number;
  backgroundHeight?: number;
}

interface PosterDimensions {
  posterWidth: number;
  posterHeight: number;
}

const calculateBackgroundDimensions = (): BackgroundDimensions => {
  if (window.innerWidth > 400) {
    return {};
  }

  return {
    backgroundWidth: 400,
    backgroundHeight: 1000,
  };
};

const calculatePosterDimensions = (): PosterDimensions => {
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

const Headers: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const [trailerWindowOpen, setTrailerWindowOpen] = useState<boolean>(false);
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");
  const { t: tRoot } = useTranslation("root");
  const { t: tTags } = useTranslation("media\\media");
  const {
    isFetching,
    error,
    data,
  }: UseQueryResult<MovieHeadersSection, TypeError | Response> = useQuery(
    `movie-title/${dataResponse.body.id}/${language}/headers`,
    (): Promise<MovieHeadersSection> => {
      return fetch(dataResponse.body.data.headers).then((response: Response) =>
        response.json()
      );
    },
    fetchOptions
  );
  const [backgroundLoaded, setBackgoundLoaded] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<boolean>(false);
  const { backgroundWidth, backgroundHeight } = calculateBackgroundDimensions();
  const { posterWidth, posterHeight } = calculatePosterDimensions();

  if (isFetching) {
    return <SuspenseComponent minHeight customText={tRoot("utils.apiFetch")} />;
  }

  if (error || !data) {
    return null;
  }

  let background;

  if (data.backgroundImage) {
    background = new Image();
    background.src = fetchImage({
      type: "background",
      width: backgroundWidth,
      height: backgroundHeight,
      image: data.backgroundImage,
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
      {data.trailer && (
        <YouTubePlayer
          title={`${data.title} - ${t("headers.trailerWindowTitle")}`}
          videoID={data.trailer}
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
              opacity: 0.6;
            `}
          />
        )}
        <FlexContainer pageBodyWidth allowWrap className={styles.headers}>
          {data.moviePoster && (
            <ImageComponent
              withBackground
              withBoxShadow
              placeholder={fetchImage({
                type: "image",
                image: data.moviePoster,
                width: Math.ceil(posterWidth / 5),
                height: Math.ceil(posterHeight / 5),
              })}
              image={fetchImage({
                type: "image",
                image: data.moviePoster,
                width: posterWidth,
                height: posterHeight,
              })}
              alt={dataResponse.body.title}
              width={posterWidth}
              height={posterHeight}
              className={styles["movie-poster"]}
            />
          )}
          <FlexContainer column className={styles["headers-content"]}>
            <h1>
              {data.title}
              {data.internationalTitle && ` (${data.internationalTitle})`}
            </h1>
            <h2>{data.companies.join(", ")}</h2>
            {data.releaseDate && (
              <h2>
                {new Intl.DateTimeFormat(language).format(
                  new Date(data.releaseDate)
                )}
                {data.duration ? ` • ${data.duration}` : ""}
                {data.publicType ? ` • ${data.publicType}` : ""}
              </h2>
            )}
            {data.synopsis && (
              <p>
                <q className={containerStyle.quotes}>{data.synopsis}</q>
              </p>
            )}
            {data.quotation && (
              <p>
                <q className={containerStyle.quotes}>{data.quotation}</q>
              </p>
            )}
            {data.type && (
              <ButtonsGroup minimal>
                {data.type.map((tag: string): React.ReactElement => {
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
              {data.trailer && (
                <Button
                  onClick={() => {
                    const isMobileDevice: boolean = detectMobileDevice();

                    if (isMobileDevice) {
                      window.open(
                        `https://www.youtube.com/watch?v=${data.trailer}`
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
