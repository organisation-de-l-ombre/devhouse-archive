import React from "react";
import styles from "./Videos.module.scss";
import containerStyle from "../../Containers.module.scss";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import { Item, Summary } from "../../../../components/Summary/Summary";
import YouTubePlayer from "../../../../components/YouTubePlayer/YouTubePlayer";
import { MovieObject, TrailerObject, VideoObject } from "../../Types";

const Videos: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  const { videos } = dataResponse;
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [video, setvideo] = React.useState<TrailerObject | VideoObject>({
    title: "",
    videoID: "",
    main: false,
  });
  return (
    <>
      <YouTubePlayer
        title={video.title}
        videoID={video.videoID}
        autoPlay
        open={playerOpen}
        setOpen={setPlayerOpen}
        autoClose
      />
      <FlexContainer
        className={`${flexContainerStyles.container} ${styles.container} ${containerStyle.container}`}
      >
        <Summary className={containerStyle.summary}>
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
            {videos.trailers.map(
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
                      src={`https://img.youtube.com/vi/${trailer.videoID}/mqdefault.jpg`}
                      alt={trailer.title}
                    />
                    <h3>{trailer.title}</h3>
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
            {videos.songs.map(
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
                      src={`https://img.youtube.com/vi/${song.videoID}/mqdefault.jpg`}
                      alt={song.title}
                    />
                    <h3>{song.title}</h3>
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
            {videos.extracts.map(
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
                      src={`https://img.youtube.com/vi/${extract.videoID}/mqdefault.jpg`}
                      alt={extract.title}
                    />
                    <h3>{extract.title}</h3>
                  </FlexContainer>
                );
              }
            )}
          </FlexContainer>
        </FlexContainer>
        <FlexContainer
          className={`${flexContainerStyles.container} ${styles["videos-container-root"]}`}
        >
          <h1>Bonus / Extras</h1>
          <FlexContainer
            id="extras"
            className={`${flexContainerStyles.container} ${styles["videos-container"]}`}
          >
            {videos.extras.map(
              (extra: VideoObject): React.ReactElement => {
                return (
                  <FlexContainer
                    key={extra.title}
                    className={`${flexContainerStyles.container} ${styles["video-container"]}`}
                    onClick={() => {
                      setvideo(extra);
                      setPlayerOpen(!playerOpen);
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${extra.videoID}/mqdefault.jpg`}
                      alt={extra.title}
                    />
                    <h3>{extra.title}</h3>
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
