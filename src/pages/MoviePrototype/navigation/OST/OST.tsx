import React from "react";
import { SiSpotify, SiDeezer, SiApplemusic } from "react-icons/si";
import { FaMusic } from "react-icons/fa";
import { FaPlay } from "react-icons/all";
import styles from "./OST.module.scss";
import containerStyle from "../../Containers.module.scss";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import cardStyles from "../../../../components/Card/Card.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import {
  MovieObject,
  SongInformationObject,
  StreamingObject,
  TrailerObject,
  VideoObject,
} from "../../Types";
import { Summary, Item } from "../../../../components/Summary/Summary";
import Button from "../../../../components/Button/Button";
import Card from "../../../../components/Card/Card";
import YouTubePlayer from "../../../../components/YouTubePlayer/YouTubePlayer";

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
  const windowWidth = (75 / 100) * window.innerWidth;
  const windowHeight = (80 / 100) * window.innerHeight;

  return (
    <>
      <YouTubePlayer
        title={video.title}
        videoID={video.videoID}
        width={windowWidth}
        height={windowHeight}
        autoPlay
        open={playerOpen}
        setOpen={setPlayerOpen}
        containerClassName={containerStyle["modal-container-styles"]}
        modalClassName={containerStyle["modal-styles"]}
        autoClose
        style={{ width: `${windowWidth}px`, height: `${windowHeight}px` }}
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
          <div
            className={`${containerStyle["headers-buttons"]} ${styles["headers-buttons-margin"]}`}
          >
            {dataResponse.ost.streaming.map(
              (streaming: StreamingObject): React.ReactElement => {
                return (
                  <Button
                    key={streaming.service}
                    onClick={() => window.open(streaming.album)}
                  >
                    <DisplaySVG type={streaming.service} />
                    <span>Ecouter sur {streaming.service}</span>
                  </Button>
                );
              }
            )}
          </div>
        </FlexContainer>
        <FlexContainer
          id="songs"
          className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
        >
          <h1>Chansons</h1>
          {dataResponse.ost.songs.map(
            (song: SongInformationObject): React.ReactElement => {
              return (
                <Card
                  key={song.title}
                  className={`${cardStyles.container} ${styles["card-container"]}`}
                >
                  <h2>{song.title}</h2>
                  {song.VOTitle.length ? (
                    <h2 className={styles["vo-title"]}>
                      <i>{song.VOTitle}</i>
                    </h2>
                  ) : (
                    <></>
                  )}
                  <p>Timeline dans le film : {song.timecode}</p>
                  <p>
                    Personnage{song.characters.length > 1 ? "s" : ""} :{" "}
                    {song.characters.join(", ")}
                  </p>
                  <p>
                    <q className={containerStyle.quotes}>{song.description}</q>
                  </p>
                  <div
                    className={`${containerStyle["headers-buttons"]} ${styles["headers-buttons-margin"]}`}
                  >
                    <Button
                      onClick={() => {
                        setVideo({
                          title: `Raiponce - ${song.title}`,
                          videoID: song.videoID,
                        });
                        setPlayerOpen(!playerOpen);
                      }}
                    >
                      <FaPlay />
                      <span>Voir la vidéo</span>
                    </Button>
                    {song.lyrics.length ? (
                      <Button onClick={() => window.open(song.lyrics)}>
                        <FaMusic />
                        <span>Paroles</span>
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
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
