import { css } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import React, { useCallback, useRef, useState } from "react";

interface ImageProps {
  withBackground?: boolean;
  placeholder: string;
  image: string;
  alt: string;
  width: number;
  height: number;
}

const Image: FunctionComponent<HTMLDivElement, ImageProps> = ({
  withBackground,
  placeholder,
  image,
  alt,
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

  return (
    <div
      css={css`
        width: ${width}px;
        height: ${height}px !important;
        overflow: hidden;
        border-radius: 5px;
        box-shadow: 0 0 0.3rem black;
        ${withBackground &&
        "background-color: var(--primary-background-color);"}

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
        ref={placeholderRef}
        onError={loadSuccessful}
        css={{ filter: "blur(5px)" }}
      />
      <img
        src={image}
        alt={alt}
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
