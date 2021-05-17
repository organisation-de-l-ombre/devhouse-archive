import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlay, MdMovie } from "react-icons/all";
import detectMobileDevice from "@lib/detectMobileDevice";
import { useLanguage } from "@hooks/Language";
import {
  FlexContainer,
  Button,
  YouTubePlayer,
  ButtonsGroup,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { useQuery, UseQueryResult } from "react-query";
import fetchOptions from "@lib/api/fetchOptions";
import { Suspense } from "@components/modules";
import { animated, useSpring } from "react-spring";
import styles from "./Headers.module.scss";
import containerStyle from "../../Containers.module.scss";
import {
  ReactMovieElement,
  MovieHeaders as MovieHeadersType,
} from "../../types";

const Headers: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const [trailerWindowOpen, setTrailerWindowOpen] = React.useState<boolean>(
    false
  );
  const { t } = useTranslation("pages\\movieTitle\\headers");
  const { t: tRoot } = useTranslation("pages\\movieTitle\\root");
  const { t: tTags } = useTranslation("pages\\movieTitle\\tags");
  const { isFetching, data }: UseQueryResult<MovieHeadersType> = useQuery(
    `movie-title/${dataResponse.body.id}/headers`,
    (): Promise<MovieHeadersType> => {
      return fetch(dataResponse.body.data.headers).then((response: Response) =>
        response.json()
      );
    },
    fetchOptions
  );
  const headersStyles = useSpring({
    from: { opacity: "0" },
    to: { opacity: "1" },
    config: { duration: 500 },
  });

  if (isFetching) {
    return <Suspense customText={tRoot("fetchingData")} />;
  }

  if (!data) {
    return <></>;
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
      <animated.div
        style={headersStyles}
        className={styles["headers-background"]}
      >
        {data.backgroundImage ? (
          <div
            className={styles["headers-background-image"]}
            style={{
              backgroundImage: `url("${data.backgroundImage}")`,
            }}
          />
        ) : (
          <div className={styles["headers-no-background-image"]} />
        )}
        <FlexContainer className={styles.headers}>
          {data.moviePoster && (
            <div className={styles["movie-poster"]}>
              <img
                src={data.moviePoster}
                alt={`Movie poster of ${data.title}`}
                draggable={false}
              />
            </div>
          )}
          <FlexContainer className={styles["headers-container"]}>
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
                {data.type.map(
                  (tag: string): React.ReactElement => {
                    return (
                      <NavLink key={tag} to={`/browse?tag=${tag}`}>
                        <Trans t={tTags} i18nKey={tag} />
                      </NavLink>
                    );
                  }
                )}
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
      </animated.div>
    </>
  );
};

export default Headers;
