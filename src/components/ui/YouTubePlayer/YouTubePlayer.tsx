import React, { useCallback, useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
import YouTube from "react-youtube";
import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import Modal from "../Modal/Modal";

interface PlayerDimensions {
  width: number;
  height: number;
}

const iconStyles = {
  maxWidth: "20px",
  maxHeight: "20px",
};

const getPlayerDimensions = (): PlayerDimensions => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const width = (75 / 100) * windowWidth;
  const height =
    windowWidth > windowHeight
      ? (80 / 100) * windowHeight
      : (50 / 100) * windowHeight;

  return { width, height };
};

const YouTubePlayer: FunctionComponent<
  HTMLDivElement,
  {
    title: string;
    videoID: string;
    autoPlay?: boolean;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    autoClose?: boolean;
  }
> = ({ title, videoID, autoPlay, open, setOpen, autoClose }) => {
  const { width, height } = getPlayerDimensions();
  const [dimensions, setDimensions] = useState<PlayerDimensions>({
    width,
    height,
  });
  const handleResize = useCallback((): void => {
    const { width: newWidth, height: newHeight } = getPlayerDimensions();

    setDimensions({
      width: newWidth,
      height: newHeight,
    });
  }, []);

  useEffect((): (() => void) => {
    window.addEventListener("resize", handleResize);

    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playerOptions = {
    playerVars: {
      autoplay: autoPlay ? 1 : 0,
      modestbranding: 1,
      rel: 0,
    },
  } as never;
  const [isPlaying, setIsPlaying] = useState<boolean>(!!autoPlay);
  const handleEnd = useCallback((): void => {
    if (autoClose) {
      setOpen(false);
    }
  }, [autoClose, setOpen]);
  const handleStateChange = useCallback((playing: boolean): void => {
    setIsPlaying(playing);
  }, []);

  return (
    <Modal
      windowsIcon={
        isPlaying ? (
          <FaPlay css={iconStyles} />
        ) : (
          <IoMdPause css={{ ...iconStyles, transform: "scale(1.2)" }} />
        )
      }
      windowTitle={title}
      open={open}
      setOpen={setOpen}
      modalCSS={css`
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
        max-width: unset !important;
        max-height: unset !important;
      `}
      containerCSS={css`
        padding: 0 !important;

        > div {
          width: 100%;
          height: 100%;

          iframe {
            width: 100%;
            height: 100%;
            margin: 0;
          }
        }
      `}
    >
      <YouTube
        videoId={videoID}
        opts={playerOptions}
        onPlay={() => handleStateChange(true)}
        onPause={() => handleStateChange(false)}
        onEnd={handleEnd}
      />
    </Modal>
  );
};

export default YouTubePlayer;
