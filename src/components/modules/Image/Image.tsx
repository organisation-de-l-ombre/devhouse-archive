import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import React, { useCallback, useRef, useState } from "react";

interface ImageProps {
  withBackground?: boolean;
  withBorderRadius?: boolean;
  withBoxShadow?: boolean;
  placeholder: string;
  image: string;
  alt: string;
  draggable?: boolean;
  width: number;
  height: number;
}

const Image: FunctionComponent<HTMLDivElement, ImageProps> = ({
  withBackground,
  withBoxShadow,
  withBorderRadius,
  placeholder,
  image,
  alt,
  draggable,
  width,
  height,
  ...props
}) => {
  const placeholderRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const loadSuccessful = useCallback((): void => {
    if (placeholderRef.current) {
      placeholderRef.current.remove();
    }

    setLoaded(true);
  }, []);

  if (typeof window === "undefined") {
    return (
      <div
        css={css`
          width: ${width}px;
          height: ${height}px !important;
          overflow: hidden;
          ${withBackground &&
          "background-color: var(--primary-background-color);"}
          ${withBorderRadius && "border-radius: 5px;"}
          ${withBoxShadow && "box-shadow: 0 0 0.3rem black;"}
        `}
        {...props}
      />
    );
  }

  return (
    <div
      css={css`
        width: ${width}px;
        height: ${height}px !important;
        overflow: hidden;
        ${withBackground &&
        "background-color: var(--primary-background-color);"}
        ${withBorderRadius && "border-radius: 5px;"}
        ${withBoxShadow && "box-shadow: 0 0 0.3rem black;"}
  
        img {
          width: 100%;
          height: 100%;
          font-size: 18px;
        }
      `}
      {...props}
    >
      <img
        src={placeholder}
        alt={alt}
        draggable={draggable}
        ref={placeholderRef}
        onError={loadSuccessful}
        css={{ filter: "blur(5px)" }}
      />
      <img
        src={image}
        alt={alt}
        draggable={draggable}
        onError={loadSuccessful}
        onLoad={loadSuccessful}
        css={css`
          ${!loaded && "filter: blur(5px);"}
          transition: filter 0.5s;
        `}
      />
    </div>
  );
};

export default Image;
