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
import { MovieObject, TrailerObject } from "../../Types";

const MovieHeaders: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  const [trailerWindowOpen, setTrailerWindowOpen] = React.useState<boolean>(
    false
  );
  const trailer = dataResponse.videos.trailers.find(
    (element: TrailerObject): boolean => element.main
  ) as TrailerObject;
  return (
    <>
      <YouTubePlayer
        title={trailer.title}
        videoID={trailer.videoID}
        autoPlay
        open={trailerWindowOpen}
        setOpen={setTrailerWindowOpen}
        autoClose
      />
      <div
        className={`${styles["headers-background"]} ${globalStyles["opacity-display-animation"]}`}
      >
        <div
          className={styles["headers-background-image"]}
          style={{
            backgroundImage: `url("${dataResponse.headers.backgroundImage}")`,
          }}
        />
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles.headers} ${globalStyles["navbar-margin"]}`}
        >
          <img
            src={dataResponse.headers.moviePoster}
            alt={dataResponse.title}
            className={styles["movie-poster"]}
            draggable={false}
          />
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles["headers-container"]}`}
          >
            <h1>{dataResponse.title}</h1>
            <h3>
              <i>{dataResponse.company}</i>
            </h3>
            <h3>
              {dataResponse.releaseDate.split("-")[2]} • {dataResponse.duration}{" "}
              • {dataResponse.publicType}
            </h3>
            <p>
              <q className={containerStyle.quotes}>
                {dataResponse.headers.synopsis}
              </q>
            </p>
            {dataResponse.headers.quotation ? (
              <p>
                <q className={containerStyle.quotes}>
                  {dataResponse.headers.quotation}
                </q>
              </p>
            ) : (
              <></>
            )}
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
            <div className={containerStyle["headers-buttons"]}>
              <Button>
                <MdMovie />
                <span>Voir en streaming</span>
              </Button>
              <Button onClick={() => setTrailerWindowOpen(!trailerWindowOpen)}>
                <FaPlay />
                <span>Bande annonce</span>
              </Button>
            </div>
          </FlexContainer>
        </FlexContainer>
      </div>
    </>
  );
};

export default MovieHeaders;
