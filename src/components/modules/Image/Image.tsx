import { css, SerializedStyles } from "@emotion/react";
import { FunctionComponent } from "@typings/FunctionComponent";
import React, { useCallback, useRef, useState } from "react";

interface ImageStylesProps {
  withBackground?: boolean;
  withBoxShadow?: boolean;
  width: number;
  height: number;
}

interface ImageProps {
  withBackground?: boolean;
  withBoxShadow?: boolean;
  placeholder: string;
  image: string;
  alt: string;
  draggable?: boolean;
  width: number;
  height: number;
}

const imageWrapperStyles = ({
  withBackground,
  withBoxShadow,
  width,
  height,
}: ImageStylesProps): SerializedStyles => {
  return css`
    width: ${width}px;
    height: ${height}px !important;
    overflow: hidden;
    border-radius: 5px;
    ${withBackground && "background-color: var(--primary-background-color);"}
    ${withBoxShadow && "box-shadow: 0 0 0.3rem black;"}

    img {
      width: 100%;
      height: 100%;
      font-size: 18px;
    }
  `;
};

const Image: FunctionComponent<HTMLDivElement, ImageProps> = ({
  withBackground,
  withBoxShadow,
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
        css={imageWrapperStyles({
          withBackground,
          withBoxShadow,
          width,
          height,
        })}
        {...props}
      >
        <img src={image} alt={alt} draggable={draggable} />
      </div>
    );
  }

  return (
    <div
      css={imageWrapperStyles({ withBackground, withBoxShadow, width, height })}
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
