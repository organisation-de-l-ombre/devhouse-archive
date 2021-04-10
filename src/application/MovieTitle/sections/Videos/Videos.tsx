import React from "react";
import detectMobileDevice from "@lib/detectMobileDevice";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  YouTubePlayer,
} from "@components/ui";
import styles from "./Videos.module.scss";
import containerStyle from "../../Containers.module.scss";
import {
  ReactMovieElement,
  SummaryObject,
  TrailerObject,
  VideoObject,
  VideosSection as VideosSectionType,
} from "../../types";

const VideosSection: ReactMovieElement = ({ dataResponse }) => {
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
        className={`${styles.container} ${containerStyle.container}`}
      >
        <Summary className={containerStyle.summary}>
          {videos.summary.map(
            (item: SummaryObject): React.ReactElement => {
              switch (item.type) {
                case "item":
                  return (
                    <SummaryItem key={item.to} to={item.to} name={item.name} />
                  );

                default:
                  return <></>;
              }
            }
          )}
        </Summary>
        {videos.trailers ? (
          <FlexContainer className={styles["videos-container-root"]}>
            <h1 id={videos.trailers.id}>{videos.trailers.name}</h1>
            <FlexContainer className={styles["videos-container"]}>
              {videos.trailers.videos.map(
                (trailer: TrailerObject): React.ReactElement => {
                  return (
                    <FlexContainer
                      key={trailer.title}
                      className={styles["video-container"]}
                      onClick={() => {
                        const isMobileDevice: boolean = detectMobileDevice();

                        if (isMobileDevice) {
                          window.open(
                            `https://www.youtube.com/watch?v=${trailer.videoID}`
                          );
                        } else {
                          setVideoState(trailer);
                          setPlayerOpen(!playerOpen);
                        }
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
                  className={styles["videos-container-root"]}
                >
                  <h1 id={body.id}>{body.name}</h1>
                  <FlexContainer className={styles["videos-container"]}>
                    {body.videos.map(
                      (video: VideoObject): React.ReactElement => {
                        return (
                          <FlexContainer
                            key={video.title}
                            className={styles["video-container"]}
                            onClick={() => {
                              const isMobileDevice: boolean = detectMobileDevice();

                              if (isMobileDevice) {
                                window.open(
                                  `https://www.youtube.com/watch?v=${video.videoID}`
                                );
                              } else {
                                setVideoState(video);
                                setPlayerOpen(!playerOpen);
                              }
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
