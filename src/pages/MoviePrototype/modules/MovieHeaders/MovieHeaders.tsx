import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlay, MdMovie } from "react-icons/all";
import styles from "./MovieHeaders.module.scss";
import movieObject from "../../prototype.json";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import Button from "../../../../components/Button/Button";
import YouTubePlayer from "../../../../components/YouTubePlayer/YouTubePlayer";
import { TrailerObject } from "../../Types";

const MovieHeaders = (): React.ReactElement => {
  const [trailerWindowOpen, setTrailerWindowOpen] = React.useState<boolean>(
    false
  );
  const trailer = movieObject.trailers.fr.find(
    (element: TrailerObject): boolean => element.main
  ) as TrailerObject;

  return (
    <>
      <YouTubePlayer
        title={trailer.title}
        videoID={trailer.videoID}
        width={1120}
        height={630}
        autoPlay
        open={trailerWindowOpen}
        setOpen={setTrailerWindowOpen}
        containerClassName={styles["modal-container-styles"]}
        modalClassName={styles["modal-styles"]}
        autoClose
      />
      <div className={styles["headers-background"]}>
        <div
          className={styles["headers-background-image"]}
          style={{
            backgroundImage: `url("${movieObject.headers.backgroundImage}")`,
          }}
        />
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles.headers}`}
        >
          <img
            src={movieObject.headers.moviePoster}
            alt={movieObject.title}
            className={styles["movie-poster"]}
            draggable={false}
          />
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles["headers-container"]}`}
          >
            <h1>{movieObject.title}</h1>
            <h3>
              <i>{movieObject.company}</i>
            </h3>
            <h3>
              {movieObject.releaseDate.split("-")[2]} • {movieObject.duration} •{" "}
              {movieObject.publicType}
            </h3>
            <p>
              <q>{movieObject.headers.synopsis}</q>
            </p>
            <div className={styles.tags}>
              {movieObject.type.map(
                (type: string): React.ReactElement => {
                  return (
                    <NavLink key={type} to={`/movies/tags/${type}`}>
                      {type}
                    </NavLink>
                  );
                }
              )}
            </div>
            <div className={styles["headers-buttons"]}>
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
