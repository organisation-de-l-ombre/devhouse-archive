import React, { useState, ReactElement } from "react";
import detectMobileDevice from "@lib/detectMobileDevice";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  YouTubePlayer,
} from "@components/ui";
import globalStyles from "@styles/Global.module.scss";
import { fetchOptions } from "@lib/api";
import { UseQueryResult, useQuery } from "react-query";
import useLanguage from "@hooks/useLanguage";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import classnames from "classnames";
import {
  ReactMovieElement,
  SummaryObject,
  VideoObject,
  VideosSection,
  VideosGlobalSection,
} from "../../types";
import containerStyle from "../../Containers.module.scss";
import styles from "./Videos.module.scss";

const Videos: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const {
    isFetching,
    error,
    data,
  }: UseQueryResult<VideosGlobalSection, Response> = useQuery(
    `movie-title/${dataResponse.body.id}/${language}/videos`,
    (): Promise<VideosGlobalSection> => {
      return fetch(dataResponse.body.data.videos || "").then(
        (response: Response) => response.json()
      );
    },
    fetchOptions
  );
  const [playerOpen, setPlayerOpen] = useState<boolean>(false);
  const [videoState, setVideoState] = useState<VideoObject>({
    title: "",
    videoID: "",
  });

  if (isFetching || error) {
    return (
      <HandleData
        isFetching={isFetching}
        section={dataResponse.body.data.videos}
        error={error}
      />
    );
  }

  if (!data) {
    return null;
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
        padding
        pageBodyWidth
        column
        className={containerStyle.container}
      >
        <Summary className={containerStyle.summary}>
          {data.summary.map((item: SummaryObject): ReactElement => {
            switch (item.type) {
              case "item":
                return (
                  <SummaryItem key={item.to} to={item.to} name={item.name} />
                );

              default:
                return <></>;
            }
          })}
        </Summary>
        {data.videos.map((body: VideosSection): ReactElement => {
          return (
            <FlexContainer
              column
              key={body.name}
              className={containerStyle["generic-margin-top"]}
            >
              <h1 id={body.id}>{body.name}</h1>
              <FlexContainer allowWrap>
                {body.videos.map((video: VideoObject): ReactElement => {
                  return (
                    <FlexContainer
                      column
                      key={video.title}
                      className={styles.video}
                      title={video.title}
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
                        className={classnames(
                          globalStyles["overflow-hidden"],
                          globalStyles["border-radius"]
                        )}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.videoID}/mqdefault.jpg`}
                          alt={video.title}
                        />
                      </div>
                      <h1>{video.title}</h1>
                    </FlexContainer>
                  );
                })}
              </FlexContainer>
            </FlexContainer>
          );
        })}
      </FlexContainer>
    </>
  );
};

export default Videos;
