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
import { SuspenseComponent } from "@components/modules";
import { animated, useSpring } from "react-spring";
import styles from "./Headers.module.scss";
import containerStyle from "../../Containers.module.scss";
import { ReactMovieElement, MovieHeadersSection } from "../../types";

const HeadersContainer = animated(FlexContainer);

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
  }: UseQueryResult<MovieHeadersSection, Response> = useQuery(
    `movie-title/${dataResponse.body.id}/${language}/headers`,
    (): Promise<MovieHeadersSection> => {
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
    return <SuspenseComponent customText={tRoot("fetchingData")} />;
  }

  if (error || !data) {
    return null;
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
      <HeadersContainer
        horizontallyCentered
        className={styles["headers-background"]}
        style={headersStyles}
      >
        {data.backgroundImage ? (
          <div
            css={{
              backgroundImage: `url("${data.backgroundImage}")`,
            }}
            className={styles["headers-background-image"]}
          />
        ) : (
          <div className={styles["headers-no-background-image"]} />
        )}
        <FlexContainer pageBodyWidth allowWrap className={styles.headers}>
          {data.moviePoster && (
            <div className={styles["movie-poster"]}>
              <img
                src={data.moviePoster}
                alt={`Movie poster of ${data.title}`}
                draggable={false}
              />
            </div>
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
      </HeadersContainer>
    </>
  );
};

export default Headers;
