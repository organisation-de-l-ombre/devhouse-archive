import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlay, MdMovie } from "react-icons/all";
import detectMobileDevice from "@lib/detectMobileDevice";
import { useLanguage } from "@hooks/Language";
import {
  FlexContainer,
  Button,
  YouTubePlayer,
  GenericLoader,
} from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import { Trans, useTranslation } from "react-i18next";
import { useQuery, UseQueryResult } from "react-query";
import fetchOptions from "@lib/api/fetchOptions";
import styles from "./MovieHeaders.module.scss";
import containerStyle from "../../Containers.module.scss";
import {
  ReactMovieElement,
  MovieHeaders as MovieHeadersType,
} from "../../types";

const MovieHeaders: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const [trailerWindowOpen, setTrailerWindowOpen] = React.useState<boolean>(
    false
  );
  const { t } = useTranslation("pages\\moviePrototype\\headers");
  const { t: tRoot } = useTranslation("pages\\moviePrototype\\root");
  const { isFetching, data }: UseQueryResult<MovieHeadersType> = useQuery(
    `movie-title/${dataResponse.id}/headers`,
    (): Promise<MovieHeadersType> => {
      return fetch(dataResponse.data.headers).then((response: Response) =>
        response.json()
      );
    },
    fetchOptions
  );

  if (isFetching) {
    return (
      <div
        className={`${globalStyles.flex} ${globalStyles["alignment-full-center"]} ${styles["is-fetching"]}`}
      >
        <GenericLoader className={globalStyles["alignment-full-center"]}>
          <Trans t={tRoot} i18nKey="fetchingData" />
        </GenericLoader>
      </div>
    );
  }

  if (!data) {
    return <></>;
  }

  return (
    <>
      {data.trailer ? (
        <YouTubePlayer
          title={t("trailerWindowTitle", { title: data.title })}
          videoID={data.trailer}
          autoPlay
          open={trailerWindowOpen}
          setOpen={setTrailerWindowOpen}
          autoClose
        />
      ) : (
        <></>
      )}
      <div
        className={`${styles["headers-background"]} ${globalStyles["opacity-display-animation"]}`}
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
          {data.moviePoster ? (
            <div className={styles["movie-poster"]}>
              <img
                src={data.moviePoster}
                alt={`Movie poster of ${data.title}`}
                draggable={false}
              />
            </div>
          ) : (
            <></>
          )}
          <FlexContainer className={styles["headers-container"]}>
            <h1>{data.title}</h1>
            <h2>
              <i>{data.companies.join(", ")}</i>
            </h2>
            {data.releaseDate ? (
              <h3>
                {new Intl.DateTimeFormat(language).format(
                  new Date(data.releaseDate)
                )}
                {data.duration ? ` • ${data.duration}` : ""}
                {data.publicType ? ` • ${data.publicType}` : ""}
              </h3>
            ) : (
              <></>
            )}
            {data && data.synopsis ? (
              <p>
                <q className={containerStyle.quotes}>{data.synopsis}</q>
              </p>
            ) : (
              <></>
            )}
            {data && data.quotation ? (
              <p>
                <q className={containerStyle.quotes}>{data.quotation}</q>
              </p>
            ) : (
              <></>
            )}
            {data.type ? (
              <div className={containerStyle["headers-buttons"]}>
                {data.type.map(
                  (type: string): React.ReactElement => {
                    return (
                      <NavLink key={type} to={`/browse?=tag${type}`}>
                        <span>
                          <Trans t={t} i18nKey={`tags.${type}`} />
                        </span>
                      </NavLink>
                    );
                  }
                )}
              </div>
            ) : (
              <></>
            )}
            <div className={containerStyle["headers-buttons"]}>
              <Button>
                <MdMovie />
                <span>
                  <Trans t={t} i18nKey="watch" />
                </span>
              </Button>
              {data.trailer ? (
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
              ) : (
                <></>
              )}
            </div>
          </FlexContainer>
        </FlexContainer>
      </div>
    </>
  );
};

export default MovieHeaders;
