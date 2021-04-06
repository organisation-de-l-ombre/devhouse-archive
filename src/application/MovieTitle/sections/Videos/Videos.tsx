import React from "react";
import styles from "./Videos.module.scss";
import containerStyle from "../../Containers.module.scss";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import { Item, Summary } from "../../../../components/ui/Summary/Summary";
import YouTubePlayer from "../../../../components/ui/YouTubePlayer/YouTubePlayer";
import {
  S3DataResponse,
  SummaryObject,
  TrailerObject,
  VideoObject,
  VideosSection as VideosSectionType,
} from "../../types";

const VideosSection: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: S3DataResponse }
> = ({ dataResponse }) => {
  const { videos } = dataResponse;
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [videoState, setVideoState] = React.useState<
    TrailerObject | VideoObject
  >({
    title: "",
    videoID: "",
    main: false,
  });
  return (
    <>
      <YouTubePlayer
        title={videoState.title}
        videoID={videoState.videoID}
        autoPlay
        open={playerOpen}
        setOpen={setPlayerOpen}
        autoClose
      />
      <FlexContainer
        className={`${flexContainerStyles.container} ${styles.container} ${containerStyle.container}`}
      >
        <Summary className={containerStyle.summary}>
          {videos.summary.map(
            (item: SummaryObject): React.ReactElement => {
              switch (item.type) {
                case "item":
                  return <Item key={item.to} to={item.to} name={item.name} />;

                default:
                  return <></>;
              }
            }
          )}
        </Summary>
        {videos.trailers ? (
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles["videos-container-root"]}`}
          >
            <h1 id={videos.trailers.id}>{videos.trailers.name}</h1>
            <FlexContainer
              className={`${flexContainerStyles.container} ${styles["videos-container"]}`}
            >
              {videos.trailers.videos.map(
                (trailer: TrailerObject): React.ReactElement => {
                  return (
                    <FlexContainer
                      key={trailer.title}
                      className={`${flexContainerStyles.container} ${styles["video-container"]}`}
                      onClick={() => {
                        setVideoState(trailer);
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
        ) : (
          <></>
        )}
        {videos.videos ? (
          videos.videos.map(
            (body: VideosSectionType): React.ReactElement => {
              return (
                <FlexContainer
                  key={body.name}
                  className={`${flexContainerStyles.container} ${styles["videos-container-root"]}`}
                >
                  <h1 id={body.id}>{body.name}</h1>
                  <FlexContainer
                    className={`${flexContainerStyles.container} ${styles["videos-container"]}`}
                  >
                    {body.videos.map(
                      (video: VideoObject): React.ReactElement => {
                        return (
                          <FlexContainer
                            key={video.title}
                            className={`${flexContainerStyles.container} ${styles["video-container"]}`}
                            onClick={() => {
                              setVideoState(video);
                              setPlayerOpen(!playerOpen);
                            }}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.videoID}/mqdefault.jpg`}
                              alt={video.title}
                            />
                            <h3>{video.title}</h3>
                          </FlexContainer>
                        );
                      }
                    )}
                  </FlexContainer>
                </FlexContainer>
              );
            }
          )
        ) : (
          <></>
        )}
      </FlexContainer>
    </>
  );
};

export default VideosSection;
