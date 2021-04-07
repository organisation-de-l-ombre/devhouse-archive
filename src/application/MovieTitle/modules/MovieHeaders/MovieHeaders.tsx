import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlay, MdMovie } from "react-icons/all";
import styles from "./MovieHeaders.module.scss";
import containerStyle from "../../Containers.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import Button from "../../../../components/ui/Button/Button";
import YouTubePlayer from "../../../../components/ui/YouTubePlayer/YouTubePlayer";
import { S3DataResponse, TrailerObject } from "../../types";
import useLanguage from "../../../../hooks/Language/Language";
import detectMobileDevice from "../../../../lib/detectMobileDevice";

const MovieHeaders: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: S3DataResponse }
> = ({ dataResponse }) => {
  const { language } = useLanguage();
  const [trailerWindowOpen, setTrailerWindowOpen] = React.useState<boolean>(
    false
  );
  const trailer: TrailerObject | undefined =
    dataResponse.videos && dataResponse.videos.trailers
      ? (dataResponse.videos.trailers.videos.find(
          (element: TrailerObject): boolean => element.main
        ) as TrailerObject)
      : undefined;

  return (
    <>
      {trailer !== undefined ? (
        <YouTubePlayer
          title={trailer.title}
          videoID={trailer.videoID}
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
        {dataResponse.headers && dataResponse.headers.backgroundImage ? (
          <div
            className={styles["headers-background-image"]}
            style={{
              backgroundImage: `url("${dataResponse.headers.backgroundImage}")`,
            }}
          />
        ) : (
          <div className={styles["headers-no-background-image"]} />
        )}
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles.headers}`}
        >
          {dataResponse.headers && dataResponse.headers.moviePoster ? (
            <img
              src={dataResponse.headers.moviePoster}
              alt={dataResponse.title}
              className={styles["movie-poster"]}
              draggable={false}
            />
          ) : (
            <></>
          )}
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles["headers-container"]}`}
          >
            <h1>{dataResponse.title}</h1>
            <h3>
              <i>{dataResponse.companies.join(", ")}</i>
            </h3>
            {dataResponse.releaseDate ? (
              <h3>
                {new Intl.DateTimeFormat(language).format(
                  new Date(dataResponse.releaseDate)
                )}
                {dataResponse.duration ? ` • ${dataResponse.duration}` : ""}
                {dataResponse.publicType ? ` • ${dataResponse.publicType}` : ""}
              </h3>
            ) : (
              <></>
            )}
            {dataResponse.headers && dataResponse.headers.synopsis ? (
              <p>
                <q className={containerStyle.quotes}>
                  {dataResponse.headers.synopsis}
                </q>
              </p>
            ) : (
              <></>
            )}
            {dataResponse.headers && dataResponse.headers.quotation ? (
              <p>
                <q className={containerStyle.quotes}>
                  {dataResponse.headers.quotation}
                </q>
              </p>
            ) : (
              <></>
            )}
            {dataResponse.type ? (
              <div className={containerStyle["headers-buttons"]}>
                {dataResponse.type.map(
                  (type: string): React.ReactElement => {
                    return (
                      <NavLink key={type} to={`/movies/tags/${type}`}>
                        <span>{type}</span>
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
                <span>Voir en streaming</span>
              </Button>
              {trailer ? (
                <Button
                  onClick={() => {
                    const isMobileDevice: boolean = detectMobileDevice();

                    if (isMobileDevice) {
                      window.open(
                        `https://www.youtube.com/watch?v=${trailer?.videoID}`
                      );
                    } else {
                      setTrailerWindowOpen(!trailerWindowOpen);
                    }
                  }}
                >
                  <FaPlay />
                  <span>Bande annonce</span>
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
