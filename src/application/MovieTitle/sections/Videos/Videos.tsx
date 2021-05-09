import React from "react";
import detectMobileDevice from "@lib/detectMobileDevice";
import {
  FlexContainer,
  GenericLoader,
  Summary,
  SummaryItem,
  YouTubePlayer,
} from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import { NotFound } from "@components/modules";
import fetchOptions from "@lib/api/fetchOptions";
import { useTranslation, Trans } from "react-i18next";
import { UseQueryResult, useQuery } from "react-query";
import {
  ReactMovieElement,
  SummaryObject,
  VideoObject,
  VideosSection as VideosSectionType,
  VideosGlobalSection,
} from "../../types";
import containerStyle from "../../Containers.module.scss";
import styles from "./Videos.module.scss";

const VideosSection: ReactMovieElement = ({ dataResponse }) => {
  const { t: tRoot } = useTranslation("pages\\moviePrototype\\root");
  const { isFetching, data }: UseQueryResult<VideosGlobalSection> = useQuery(
    `movie-title/${dataResponse.id}/characters`,
    (): Promise<VideosGlobalSection> => {
      return fetch(dataResponse.data.videos || "").then((response: Response) =>
        response.json()
      );
    },
    fetchOptions
  );
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [videoState, setVideoState] = React.useState<VideoObject>({
    title: "",
    videoID: "",
  });

  if (isFetching) {
    return (
      <FlexContainer className={containerStyle["is-fetching-root"]}>
        <GenericLoader className={containerStyle["is-fetching"]}>
          <Trans t={tRoot} i18nKey="fetchingData" />
        </GenericLoader>
      </FlexContainer>
    );
  }

  if (!data) {
    return <NotFound className={containerStyle.loading} />;
  }

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
          {data.summary.map(
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
        {data.videos.map(
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
                          <div
                            className={`${globalStyles["overflow-hidden"]} ${globalStyles["border-radius"]} ${globalStyles["image-rendering"]}`}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${video.videoID}/mqdefault.jpg`}
                              alt={video.title}
                            />
                          </div>
                          <h3>{video.title}</h3>
                        </FlexContainer>
                      );
                    }
                  )}
                </FlexContainer>
              </FlexContainer>
            );
          }
        )}
      </FlexContainer>
    </>
  );
};

export default VideosSection;
