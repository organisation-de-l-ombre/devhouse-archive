import React from "react";
import { SiSpotify, SiDeezer, SiApplemusic } from "react-icons/si";
import { FaMusic } from "react-icons/fa";
import { FaPlay } from "react-icons/all";
import styles from "./OST.module.scss";
import containerStyle from "../../Containers.module.scss";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import {
  MovieObject,
  OSTBody,
  StreamingObject,
  SummaryObject,
  TrackInformationObject,
  TrailerObject,
  VideoObject,
} from "../../Types";
import { Summary, Item } from "../../../../components/ui/Summary/Summary";
import Button from "../../../../components/ui/Button/Button";
import Card from "../../../../components/ui/Card/Card";
import YouTubePlayer from "../../../../components/ui/YouTubePlayer/YouTubePlayer";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const DisplaySVG = ({ type }: { type: string }): any => {
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
const OSTSection: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  const { ost } = dataResponse;
  const [playerOpen, setPlayerOpen] = React.useState<boolean>(false);
  const [video, setVideo] = React.useState<TrailerObject | VideoObject>({
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
          {ost.summary.map(
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
        <FlexContainer
          id={ost.album.id}
          className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
        >
          <h1>{ost.album.name}</h1>
          <div className={styles["album-container"]}>
            <img
              src={dataResponse.ost.album.coverURL}
              alt={dataResponse.ost.album.albumName}
              className={styles["album-headers-margin"]}
            />
            <div
              className={`${styles["album-headers"]} ${styles["album-headers-margin"]}`}
            >
              <h2>{dataResponse.ost.album.albumName}</h2>
              <p className={styles["album-headers-margin-top"]}>
                {dataResponse.ost.album.interpreters.join(", ")}
              </p>
              <div className={containerStyle["headers-buttons"]}>
                {dataResponse.ost.album.streaming.map(
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
        {ost.body.map(
          (body: OSTBody): React.ReactElement => {
            return (
              <FlexContainer
                key={body.name}
                id={body.id}
                className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
              >
                <h1>{body.name}</h1>
                {body.tracks.map(
                  (track: TrackInformationObject): React.ReactElement => {
                    return (
                      <Card
                        key={track.title}
                        className={`${cardStyles.container} ${styles["card-container"]}`}
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
                                  setVideo({
                                    title: `Raiponce - ${track.title}`,
                                    videoID: track.videoID as string,
                                  });
                                  setPlayerOpen(!playerOpen);
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
