import React, { useState } from "react";
import detectMobileDevice from "@lib/detectMobileDevice";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  YouTubePlayer,
} from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import { fetchOptions } from "@lib/api";
import { useTranslation } from "react-i18next";
import { UseQueryResult, useQuery } from "react-query";
import { SuspenseComponent } from "@components/modules";
import useLanguage from "@hooks/useLanguage";
import {
  ReactMovieElement,
  SummaryObject,
  VideoObject,
  VideosSection,
  VideosGlobalSection,
} from "../../types";
import containerStyle from "../../Containers.module.scss";
import styles from "./Videos.module.scss";
import SectionEmpty from "../../modules/SectionEmpty/SectionEmpty";

const Videos: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const { t } = useTranslation("pages\\movieTitle\\root");
  const { isFetching, data }: UseQueryResult<VideosGlobalSection> = useQuery(
    `movie-title/${dataResponse.body.id}/${language}/videos`,
    (): Promise<VideosGlobalSection> => {
      return fetch(
        dataResponse.body.data.videos || ""
      ).then((response: Response) => response.json());
    },
    fetchOptions
  );
  const [playerOpen, setPlayerOpen] = useState<boolean>(false);
  const [videoState, setVideoState] = useState<VideoObject>({
    title: "",
    videoID: "",
  });

  if (isFetching) {
    return <SuspenseComponent minHeight customText={t("fetchingData")} />;
  }
  if (!data) {
    return <SectionEmpty />;
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
          (body: VideosSection): React.ReactElement => {
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
                            className={`${globalStyles["overflow-hidden"]} ${globalStyles["border-radius"]}`}
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

export default Videos;
