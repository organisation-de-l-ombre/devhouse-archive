import React from "react";
import YouTube from "react-youtube";
import Modal from "../Modal/Modal";
import styles from "./YouTubePlayer.module.scss";
import { PlayerDimensions } from "./Types";

const getPlayerDimensions = (): PlayerDimensions => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const width =
    windowWidth > windowHeight
      ? (75 / 100) * windowWidth
      : (80 / 100) * windowWidth;
  const height =
    windowWidth > windowHeight
      ? (80 / 100) * windowHeight
      : (30 / 100) * windowHeight;

  return { width, height };
};
const YouTubePlayer: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    title: string;
    videoID: string;
    autoPlay?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    autoClose?: boolean;
  }
> = ({ title, videoID, autoPlay, open, setOpen, autoClose }) => {
  const { width, height } = getPlayerDimensions();
  const playerOptions = {
    width,
    height,
    playerVars: {
      autoplay: autoPlay ? 1 : 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <Modal
      windowTitle={title}
      open={open}
      setOpen={setOpen}
      containerClassName={styles["modal-container"]}
      modalClassName={styles["modal-root"]}
    >
      <YouTube
        videoId={videoID}
        opts={playerOptions as never}
        onEnd={() => {
          if (autoClose) {
            setOpen(!open);
          }
        }}
      />
    </Modal>
  );
};

export default YouTubePlayer;
