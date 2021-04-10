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
} from "@components/ui";
import styles from "./OST.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import {
  ReactMovieElement,
  StreamingObject,
  SummaryObject,
  TrackInformationObject,
  TracksSection,
  TrailerObject,
  VideoObject,
} from "../../types";

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
  const { ost } = dataResponse;
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [video, setVideo] = React.useState<TrailerObject | VideoObject>({
    title: "",
    videoID: "",
    main: false,
  });
  const [videosLength, setVideosLength] = React.useState<number>(0);

  React.useEffect((): void => {
    if (!ost) {
      return;
    }

    ost.body.forEach((section: TracksSection): void => {
      section.tracks.forEach((track: TrackInformationObject): void => {
        if (track.videoID) {
          setVideosLength((previousState: number): number => previousState + 1);
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ost) {
    return <></>;
  }

  return (
    <>
      {videosLength > 0 ? (
        <YouTubePlayer
          title={video.title}
          videoID={video.videoID}
          autoPlay
          open={playerOpen}
          setOpen={setPlayerOpen}
          autoClose
        />
      ) : (
        <></>
      )}
      <FlexContainer
        className={`${styles.container} ${containerStyle.container}`}
      >
        <Summary className={containerStyle.summary}>
          {ost.summary.map(
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
        {ost.album ? (
          <FlexContainer
            id={ost.album.id}
            className={`${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
          >
            <h1>{ost.album.name}</h1>
            <div className={styles["album-container"]}>
              <img
                src={ost.album.coverURL}
                alt={ost.album.albumName}
                className={styles["album-headers-margin"]}
              />
              <div
                className={`${styles["album-headers"]} ${styles["album-headers-margin"]}`}
              >
                <h2>{ost.album.albumName}</h2>
                <p className={styles["album-headers-margin-top"]}>
                  {ost.album.interpreters.join(", ")}
                </p>
                <div className={containerStyle["headers-buttons"]}>
                  {ost.album.streaming.map(
                    (streaming: StreamingObject): React.ReactElement => {
                      return (
                        <a
                          key={streaming.service}
                          href={streaming.album}
                          target="blank"
                          className={styles["album-headers-margin-top"]}
                        >
                          <DisplaySVG type={streaming.service} />
                          <span>Ecouter sur {streaming.service}</span>
                        </a>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </FlexContainer>
        ) : (
          <></>
        )}
        {ost.body.map(
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
                        {track.VOTitle ? (
                          <h2 className={styles["vo-title"]}>
                            <i>{track.VOTitle}</i>
                          </h2>
                        ) : (
                          <></>
                        )}
                        <p>Durée : {track.duration}</p>
                        {track.timecode ? (
                          <p>Timeline dans le film : {track.timecode}</p>
                        ) : (
                          <></>
                        )}
                        {track.characters ? (
                          <p>
                            Personnage{track.characters.length > 1 ? "s" : ""} :{" "}
                            {track.characters.join(", ")}
                          </p>
                        ) : (
                          <></>
                        )}
                        {track.description ? (
                          <p>
                            <q className={containerStyle.quotes}>
                              {track.description}
                            </q>
                          </p>
                        ) : (
                          <></>
                        )}
                        {track.videoID || track.lyrics ? (
                          <div
                            className={`${containerStyle["headers-buttons"]} ${styles["headers-buttons-margin"]}`}
                          >
                            {track.videoID ? (
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
                            ) : (
                              <></>
                            )}
                            {track.lyrics ? (
                              <a href={track.lyrics} target="blank">
                                <FaMusic />
                                <span>Paroles</span>
                              </a>
                            ) : (
                              <></>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
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
