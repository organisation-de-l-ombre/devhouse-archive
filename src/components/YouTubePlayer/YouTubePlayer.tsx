import React from "react";
import YouTube from "react-youtube";
import Modal from "../Modal/Modal";

const YouTubePlayer: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    title: string;
    videoID: string;
    width?: number;
    height?: number;
    autoPlay?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    containerClassName?: string;
    modalClassName?: string;
    autoClose?: boolean;
  }
> = ({
  title,
  videoID,
  width,
  height,
  autoPlay,
  open,
  setOpen,
  containerClassName,
  modalClassName,
  autoClose,
}) => {
  if (!width) {
    width = 560;
  }
  if (!height) {
    height = 315;
  }

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
      containerClassName={containerClassName}
      modalClassName={modalClassName}
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
