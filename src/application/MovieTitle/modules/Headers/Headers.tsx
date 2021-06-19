import React, { useState } from "react";
import { FaPlay, MdMovie } from "react-icons/all";
import detectMobileDevice from "@lib/detectMobileDevice";
import useLanguage from "@hooks/useLanguage";
import {
  FlexContainer,
  ButtonLink,
  Button,
  YouTubePlayer,
  ButtonsGroup,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { useQuery, UseQueryResult } from "react-query";
import fetchOptions from "@lib/api/fetchOptions";
import {
  SuspenseComponent,
  Image as ImageComponent,
} from "@components/modules";
import fetchImage from "@lib/fetchImage";
import { css } from "@emotion/react";
import styles from "./Headers.module.scss";
import containerStyle from "../../Containers.module.scss";
import { ReactMovieElement, MovieHeadersSection } from "../../types";

interface PosterDimensions {
  width: number;
  height: number;
}

const calculatePosterDimensions = (): PosterDimensions => {
  const initialWidth = 270;
  const initialHeight = 400;
  const ratio = 270 / 400;

  if (window.innerWidth > 400) {
    return { width: initialWidth, height: initialHeight };
  }

  const width = Math.ceil((40 / 100) * window.innerWidth);

  return {
    width,
    height: Math.ceil(width * (1 / ratio)),
  };
};

const Headers: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const [trailerWindowOpen, setTrailerWindowOpen] = useState<boolean>(false);
  const { t } = useTranslation("pages\\movieTitle\\headers");
  const { t: tRoot } = useTranslation("pages\\movieTitle\\root");
  const { t: tTags } = useTranslation("pages\\movieTitle\\tags");
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
  const { width, height } = calculatePosterDimensions();
  const [backgroundLoaded, setBackgoundLoaded] = useState<boolean>(false);

  if (isFetching) {
    return <SuspenseComponent customText={tRoot("fetchingData")} />;
  }

  if (error || !data) {
    return null;
  }

  let background;

  if (data.backgroundImage) {
    background = new Image();
    background.src = data.backgroundImage;
    background.onload = (): void => {
      setBackgoundLoaded(true);
    };
  }

  return (
    <>
      {data.trailer && (
        <YouTubePlayer
          title={`${data.title} - ${t("trailerWindowTitle")}`}
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
              opacity: var(--media-headers-background-opacity);
              ${!backgroundLoaded && "filter: blur(5px);"}
              transition: filter 0.5s;
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
              placeholder={fetchImage({
                type: "image",
                image: data.moviePoster,
                width: width / 5,
                height: height / 5,
              })}
              image={fetchImage({
                type: "image",
                image: data.moviePoster,
                width,
                height,
              })}
              alt={dataResponse.body.title}
              width={width}
              height={height}
              className={styles["movie-poster"]}
            />
          )}
          <FlexContainer column className={styles["headers-content"]}>
            <h1>{data.title}</h1>
            <h2>
              <i>{data.companies.join(", ")}</i>
            </h2>
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
                      <Trans t={tTags} i18nKey={tag} />
                    </ButtonLink>
                  );
                })}
              </ButtonsGroup>
            )}
            <ButtonsGroup minimal>
              <Button>
                <MdMovie />
                <span>
                  <Trans t={t} i18nKey="watch" />
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
                    <Trans t={t} i18nKey="trailer" />
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
