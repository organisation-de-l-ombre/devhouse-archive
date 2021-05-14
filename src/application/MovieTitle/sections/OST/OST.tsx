import React from "react";
import { SiSpotify, SiDeezer, SiApplemusic } from "react-icons/si";
import { FaMusic, FaPlay } from "react-icons/fa";
import detectMobileDevice from "@lib/detectMobileDevice";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  Button,
  Card,
  YouTubePlayer,
  ButtonsGroup,
} from "@components/ui";
import fetchOptions from "@lib/api/fetchOptions";
import { useTranslation } from "react-i18next";
import { UseQueryResult, useQuery } from "react-query";
import styles from "./OST.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import {
  OSTSection as OSTSectionType,
  ReactMovieElement,
  StreamingObject,
  SummaryObject,
  TrackInformationObject,
  TracksSection,
  VideoObject,
} from "../../types";
import SectionEmpty from "../../modules/SectionEmpty/SectionEmpty";
import { Suspense } from "../../../../components/modules";

const DisplaySVG = ({ type }: { type: string }): React.ReactElement => {
  switch (type) {
    case "Spotify":
      return <SiSpotify />;
    case "Deezer":
      return <SiDeezer />;
    case "Apple Music":
      return <SiApplemusic />;
    default:
      return <FaMusic />;
  }
};

const OSTSection: ReactMovieElement = ({ dataResponse }) => {
  const { t } = useTranslation("pages\\movieTitle\\root");
  const { isFetching, data }: UseQueryResult<OSTSectionType> = useQuery(
    `movie-title/${dataResponse.id}/ost`,
    (): Promise<OSTSectionType> => {
      return fetch(dataResponse.data.ost || "").then((response: Response) =>
        response.json()
      );
    },
    fetchOptions
  );

  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [video, setVideo] = React.useState<VideoObject>({
    title: "",
    videoID: "",
  });

  if (isFetching) {
    return <Suspense minHeight customText={t("fetchingData")} />;
  }

  if (!data) {
    return <SectionEmpty />;
  }

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
        {data.album && (
          <FlexContainer
            id={data.album.id}
            className={`${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
          >
            <h1>{data.album.name}</h1>
            <div className={styles["album-container"]}>
              <img
                src={data.album.coverURL}
                alt={data.album.albumName}
                className={styles["album-headers-margin"]}
              />
              <div
                className={`${styles["album-headers"]} ${styles["album-headers-margin"]}`}
              >
                <h2>{data.album.albumName}</h2>
                <p className={styles["album-headers-margin-top"]}>
                  {data.album.interpreters.join(", ")}
                </p>
                <ButtonsGroup minimal>
                  {data.album.streaming.map(
                    (streaming: StreamingObject): React.ReactElement => {
                      return (
                        <a
                          key={streaming.service}
                          href={streaming.album}
                          target="blank"
                          className={styles["album-headers-margin-top"]}
                        >
                          <DisplaySVG type={streaming.service} />
                          <span>{streaming.service}</span>
                        </a>
                      );
                    }
                  )}
                </ButtonsGroup>
              </div>
            </div>
          </FlexContainer>
        )}
        {data.body.map(
          (body: TracksSection): React.ReactElement => {
            return (
              <FlexContainer
                key={body.name}
                id={body.id}
                className={`${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
              >
                <h1>{body.name}</h1>
                {body.tracks.map(
                  (track: TrackInformationObject): React.ReactElement => {
                    return (
                      <Card
                        key={track.title}
                        className={styles["card-container"]}
                      >
                        <h2>{track.title}</h2>
                        {track.VOTitle && (
                          <h2 className={styles["vo-title"]}>
                            <i>{track.VOTitle}</i>
                          </h2>
                        )}
                        <p>Durée : {track.duration}</p>
                        {track.timecode && (
                          <p>Timeline dans le film : {track.timecode}</p>
                        )}
                        {track.characters && (
                          <p>
                            Personnage{track.characters.length > 1 ? "s" : ""} :{" "}
                            {track.characters.join(", ")}
                          </p>
                        )}
                        {track.description && (
                          <p>
                            <q className={containerStyle.quotes}>
                              {track.description}
                            </q>
                          </p>
                        )}
                        {track.videoID ||
                          (track.lyrics && (
                            <ButtonsGroup minimal>
                              {track.videoID && (
                                <Button
                                  onClick={() => {
                                    const isMobileDevice: boolean = detectMobileDevice();

                                    if (isMobileDevice) {
                                      window.open(
                                        `https://www.youtube.com/watch?v=${track.videoID}`
                                      );
                                    } else {
                                      setVideo({
                                        title: `${dataResponse.title} - ${track.title}`,
                                        videoID: track.videoID as string,
                                      });
                                      setPlayerOpen(!playerOpen);
                                    }
                                  }}
                                >
                                  <FaPlay />
                                  <span>Voir la vidéo</span>
                                </Button>
                              )}
                              {track.lyrics && (
                                <a href={track.lyrics} target="blank">
                                  <FaMusic />
                                  <span>Paroles</span>
                                </a>
                              )}
                            </ButtonsGroup>
                          ))}
                      </Card>
                    );
                  }
                )}
              </FlexContainer>
            );
          }
        )}
      </FlexContainer>
    </>
  );
};

export default OSTSection;
