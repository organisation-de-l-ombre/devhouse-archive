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
  MusicInformationObject,
  SongInformationObject,
  StreamingObject,
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
const OST: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
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
          <Item to="#ost" name="Accès aux bandes originales" />
          <Item to="#songs" name="Chansons" />
          <Item to="#music" name="Musique" />
        </Summary>
        <FlexContainer
          id="ost"
          className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
        >
          <h1>Accès aux bandes originales</h1>
          <div className={styles["album-container"]}>
            <img
              src={dataResponse.ost.album.coverURL}
              alt={dataResponse.ost.album.name}
              className={styles["album-headers-margin"]}
            />
            <div
              className={`${styles["album-headers"]} ${styles["album-headers-margin"]}`}
            >
              <h2>{dataResponse.ost.album.name}</h2>
              <p className={styles["album-headers-margin-top"]}>
                {dataResponse.ost.album.interpreters.join(", ")}
              </p>
              <div className={containerStyle["headers-buttons"]}>
                {dataResponse.ost.streaming.map(
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
        <FlexContainer
          id="songs"
          className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
        >
          <h1>Musique</h1>
          {dataResponse.ost.songs.map(
            (song: SongInformationObject): React.ReactElement => {
              return (
                <Card
                  key={song.title}
                  className={`${cardStyles.container} ${styles["card-container"]}`}
                >
                  <h2>{song.title}</h2>
                  {song.VOTitle ? (
                    <h2 className={styles["vo-title"]}>
                      <i>{song.VOTitle}</i>
                    </h2>
                  ) : (
                    <></>
                  )}
                  <p>Durée : {song.duration}</p>
                  {song.timecode ? (
                    <p>Timeline dans le film : {song.timecode}</p>
                  ) : (
                    <></>
                  )}
                  {song.characters ? (
                    <p>
                      Personnage{song.characters.length > 1 ? "s" : ""} :{" "}
                      {song.characters.join(", ")}
                    </p>
                  ) : (
                    <></>
                  )}
                  {song.description ? (
                    <p>
                      <q className={containerStyle.quotes}>
                        {song.description}
                      </q>
                    </p>
                  ) : (
                    <></>
                  )}
                  {song.videoID || song.lyrics ? (
                    <div
                      className={`${containerStyle["headers-buttons"]} ${styles["headers-buttons-margin"]}`}
                    >
                      {song.videoID ? (
                        <Button
                          onClick={() => {
                            setVideo({
                              title: `Raiponce - ${song.title}`,
                              videoID: song.videoID as string,
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
                      {song.lyrics ? (
                        <a href={song.lyrics} target="blank">
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
        <FlexContainer
          id="music"
          className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
        >
          <h1>Musique</h1>
          {dataResponse.ost.music.map(
            (song: MusicInformationObject): React.ReactElement => {
              return (
                <Card
                  key={song.title}
                  className={`${cardStyles.container} ${styles["card-container"]}`}
                >
                  <h2>{song.title}</h2>
                  {song.VOTitle ? (
                    <h2 className={styles["vo-title"]}>
                      <i>{song.VOTitle}</i>
                    </h2>
                  ) : (
                    <></>
                  )}
                  <p>Durée : {song.duration}</p>
                  {song.timecode ? (
                    <p>Timeline dans le film : {song.timecode}</p>
                  ) : (
                    <></>
                  )}
                  {song.characters ? (
                    <p>
                      Personnage{song.characters.length > 1 ? "s" : ""} :{" "}
                      {song.characters.join(", ")}
                    </p>
                  ) : (
                    <></>
                  )}
                  {song.description ? (
                    <p>
                      <q className={containerStyle.quotes}>
                        {song.description}
                      </q>
                    </p>
                  ) : (
                    <></>
                  )}
                </Card>
              );
            }
          )}
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default OST;
