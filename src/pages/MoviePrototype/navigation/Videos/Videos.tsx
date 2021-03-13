import React from "react";
import styles from "./Videos.module.scss";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import { Item, Summary } from "../../../../components/Summary/Summary";
import movieObject from "../../prototype.json";
import YouTubePlayer from "../../../../components/YouTubePlayer/YouTubePlayer";
import { TrailerObject, VideoObject } from "../../Types";

const Videos = (): React.ReactElement => {
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [video, setvideo] = React.useState<TrailerObject | VideoObject>({
    title: "",
    videoID: "",
    main: false,
  });
  const windowWidth = (75 / 100) * window.innerWidth;
  const windowHeight = (80 / 100) * window.innerHeight;

  return (
    <>
      <YouTubePlayer
        title={video.title}
        videoID={video.videoID}
        width={windowWidth}
        height={windowHeight}
        autoPlay
        open={playerOpen}
        setOpen={setPlayerOpen}
        containerClassName={styles["modal-container-styles"]}
        modalClassName={styles["modal-styles"]}
        autoClose
        style={{ width: `${windowWidth}px`, height: `${windowHeight}px` }}
      />
      <FlexContainer
        className={`${flexContainerStyles.container} ${styles.container}`}
      >
        <Summary className={styles.summary}>
          <Item to="#trailers" name="Bandes annonces" />
          <Item to="#songs" name="Chansons" />
          <Item to="#extracts" name="Extraits" />
          <Item to="#extras" name="Bonus / Extras" />
        </Summary>
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles["videos-container-root"]}`}
        >
          <h1>Bandes annonces</h1>
          <FlexContainer
            id="trailers"
            className={`${flexContainerStyles.container} ${styles["videos-container"]}`}
          >
            {movieObject.videos.trailers.map(
              (trailer: TrailerObject): React.ReactElement => {
                return (
                  <FlexContainer
                    key={trailer.title}
                    className={`${flexContainerStyles.container} ${styles["video-container"]}`}
                    onClick={() => {
                      setvideo(trailer);
                      setPlayerOpen(!playerOpen);
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${trailer.videoID}/hqdefault.jpg`}
                      alt={trailer.title}
                    />
                    <h2>{trailer.title}</h2>
                  </FlexContainer>
                );
              }
            )}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles["videos-container-root"]}`}
        >
          <h1>Chansons</h1>
          <FlexContainer
            id="songs"
            className={`${flexContainerStyles.container} ${styles["videos-container"]}`}
          >
            {movieObject.videos.songs.map(
              (song: VideoObject): React.ReactElement => {
                return (
                  <FlexContainer
                    key={song.title}
                    className={`${flexContainerStyles.container} ${styles["video-container"]}`}
                    onClick={() => {
                      setvideo(song);
                      setPlayerOpen(!playerOpen);
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${song.videoID}/hqdefault.jpg`}
                      alt={song.title}
                    />
                    <h2>{song.title}</h2>
                  </FlexContainer>
                );
              }
            )}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles["videos-container-root"]}`}
        >
          <h1>Extraits</h1>
          <FlexContainer
            id="extracts"
            className={`${flexContainerStyles.container} ${styles["videos-container"]}`}
          >
            {movieObject.videos.extracts.map(
              (extract: VideoObject): React.ReactElement => {
                return (
                  <FlexContainer
                    key={extract.title}
                    className={`${flexContainerStyles.container} ${styles["video-container"]}`}
                    onClick={() => {
                      setvideo(extract);
                      setPlayerOpen(!playerOpen);
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${extract.videoID}/hqdefault.jpg`}
                      alt={extract.title}
                    />
                    <h2>{extract.title}</h2>
                  </FlexContainer>
                );
              }
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default Videos;
