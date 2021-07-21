import { css } from "@emotion/react";
import { calculateBackgroundSize } from "@lib/movieTitle";
import { MovieTitleComponent } from "@typings/movieTitle";
import React, { useState } from "react";

const Background: MovieTitleComponent = ({
  dataResponse: { localizedInformation },
}) => {
  const [backgroundLoaded, setBackgoundLoaded] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<boolean>(false);
  const backgroundSize = calculateBackgroundSize();
  let background;

  if (localizedInformation.background && typeof window !== "undefined") {
    background = new Image();
    background.src = `https://cdn.developershouse.xyz/${localizedInformation.background?.replace(
      "headers-background",
      `headers-background-${backgroundSize}.webp`
    )}`;
    background.onerror = (): void => {
      setBackgoundLoaded(true);
      setBackgroundError(true);
    };
    background.onload = (): void => {
      setBackgoundLoaded(true);
    };
  }

  if (!background) {
    return (
      <div
        css={css`
          width: 100%;
          height: 100%;
          position: absolute;
          background-color: var(--media-headers-primary-background-color);
          opacity: ${typeof window === "undefined" ? "0" : "0.6"};
        `}
      />
    );
  }

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        position: absolute;
        background-image: url("${background.src}");
        background-size: cover;
        background-repeat: no-repeat;
        background-position-x: center;
        opacity: 0;
        ${backgroundLoaded &&
        `
          background-color: var(--media-headers-primary-background-color);
          opacity: ${
            backgroundError ? "0.6" : "var(--media-headers-background-opacity)"
          };
        `}
        ${!backgroundLoaded && "filter: blur(5px);"}
        transition: background-color 0.5s, opacity 0.5s, filter 0.5s;
      `}
    />
  );
};

export default Background;
