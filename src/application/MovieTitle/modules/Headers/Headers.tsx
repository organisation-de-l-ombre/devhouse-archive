import React, { useCallback, useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { ImHeart } from "react-icons/im";
import { IoMdShareAlt } from "react-icons/io";
import { calculateDuration, detectMobileDevice, fetchImage } from "@lib/utils";
import useLanguage from "@hooks/useLanguage";
import {
  FlexContainer,
  ButtonLink,
  Button,
  ButtonsGroup,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import loadable from "@loadable/component";
import { useLocation } from "react-router";
import { MovieTitleComponent } from "@typings/movieTitle";
import styles from "./Headers.module.scss";
import containerStyle from "../../Containers.module.scss";
import ShareModal from "../ShareModal/ShareModal";

const YouTubePlayer = loadable(
  () => import("@components/ui/YouTubePlayer/YouTubePlayer")
);
const ImageComponent = loadable(
  () => import("@components/modules/Image/Image")
);

interface PosterDimensions {
  width: number;
  height: number;
}

const calculateBackgroundSize = (): "normal" | "large" | "small" => {
  const screenWidth = window.outerWidth;

  if (screenWidth > 1920) {
    return "large";
  }

  if (screenWidth < 400) {
    return "small";
  }

  return "normal";
};

const calculatePosterDimensions = (): PosterDimensions => {
  if (typeof window === "undefined") {
    return {
      width: 270,
      height: 400,
    };
  }

  const initialWidth = 270;
  const initialHeight = 400;
  const ratio = 270 / 400;

  if (window.innerWidth > 400) {
    return { width: initialWidth, height: initialHeight };
  }

  const width = Math.ceil((50 / 100) * window.innerWidth);

  return {
    width,
    height: Math.ceil(width * (1 / ratio)),
  };
};

const Headers: MovieTitleComponent = ({ dataResponse }) => {
  const { localizedInformation } = dataResponse;
  const { language } = useLanguage();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [trailerWindowOpen, setTrailerWindowOpen] = useState<boolean>(
    queryParams.get("focus") === "trailer" || false
  );
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");
  const { t: tMedia } = useTranslation("media\\media");
  const [backgroundLoaded, setBackgoundLoaded] = useState<boolean>(false);
  const [backgroundError, setBackgroundError] = useState<boolean>(false);
  const { width, height } = calculatePosterDimensions();
  const [mainInformation, setMainInformation] = useState<string[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const openShareModal = useCallback((): void => {
    setShareModalOpen(true);
  }, []);
  let background;

  useEffect((): void => {
    const temp: string[] = [];

    if (localizedInformation.releaseDate) {
      temp.push(
        new Intl.DateTimeFormat(language).format(
          new Date(localizedInformation.releaseDate)
        )
      );
    }

    if (dataResponse.duration) {
      temp.push(calculateDuration(dataResponse.duration as unknown as number));
    }

    temp.push(tMedia(`cases.${dataResponse.case}`));

    setMainInformation(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (localizedInformation.background && typeof window !== "undefined") {
    const backgroundSize = calculateBackgroundSize();

    background = new Image();
    background.src = `https://cdn.developershouse.xyz/${localizedInformation.background.replace(
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

  return (
    <>
      {localizedInformation.trailer && typeof window !== "undefined" && (
        <YouTubePlayer
          title={`${localizedInformation.title} - ${t(
            "headers.trailerWindowTitle"
          )}`}
          videoID={localizedInformation.trailer}
          autoPlay
          open={trailerWindowOpen}
          setOpen={setTrailerWindowOpen}
          autoClose
        />
      )}
      <ShareModal
        open={shareModalOpen}
        setOpen={setShareModalOpen}
        dataResponse={dataResponse}
      />
      <FlexContainer
        horizontallyCentered
        className={styles["headers-background"]}
      >
        {background ? (
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
                  backgroundError
                    ? "0.6"
                    : "var(--media-headers-background-opacity)"
                };
              `}
              ${!backgroundLoaded && "filter: blur(5px);"}
              transition: background-color 0.5s, opacity 0.5s, filter 0.5s;
            `}
          />
        ) : (
          <div
            css={css`
              width: 100%;
              height: 100%;
              position: absolute;
              background-color: var(--media-headers-primary-background-color);
              opacity: ${typeof window === "undefined" ? "0" : "0.6"};
            `}
          />
        )}
        <FlexContainer pageBodyWidth allowWrap className={styles.headers}>
          {localizedInformation.poster && (
            <ImageComponent
              withBackground
              withBorderRadius
              withBoxShadow
              placeholder={fetchImage({
                image: localizedInformation.poster,
                width: Math.ceil(width / 5),
                height: Math.ceil(height / 5),
                format: "webp",
              })}
              image={fetchImage({
                image: localizedInformation.poster,
                width,
                height,
                format: "webp",
              })}
              alt={localizedInformation.title}
              width={width}
              height={height}
              className={styles["movie-poster"]}
            />
          )}
          <FlexContainer column className={styles["headers-content"]}>
            <h1>{`${localizedInformation.title} (${dataResponse.title})`}</h1>
            <h2>
              {dataResponse.companies
                .map((company: string): string =>
                  tMedia(`companies.${company}`)
                )
                .join(", ")}
            </h2>
            {(localizedInformation.releaseDate || dataResponse.duration) && (
              <h2>{mainInformation.join(" • ")}</h2>
            )}
            <FlexContainer
              allowWrap
              verticallyCentered
              className={styles["buttons-top"]}
            >
              <button
                type="button"
                aria-label={t("headers.topButtons.grade")}
                title={t("headers.topButtons.grade")}
              >
                <BsStarFill />
                <span>4,2 / 5</span>
              </button>
              <button
                type="button"
                aria-label={t("headers.topButtons.favourites")}
                title={t("headers.topButtons.favourites")}
              >
                <ImHeart />
              </button>
              <button
                type="button"
                id="share-movie"
                aria-label={t("headers.topButtons.share")}
                title={t("headers.topButtons.share")}
                onClick={openShareModal}
              >
                <IoMdShareAlt />
              </button>
            </FlexContainer>
            {localizedInformation.description && (
              <p>
                <q className={containerStyle.quotes}>
                  {localizedInformation.description}
                </q>
              </p>
            )}
            {localizedInformation.quotation && (
              <p>
                <q className={containerStyle.quotes}>
                  {localizedInformation.quotation}
                </q>
              </p>
            )}
            {dataResponse.tags && (
              <ButtonsGroup
                minimal
                genericMarginTop
                className={styles["buttons-bottom"]}
              >
                {dataResponse.tags.map((tag: string): React.ReactElement => {
                  return (
                    <ButtonLink key={tag} to={`/browse?tag=${tag}`}>
                      <Trans t={tMedia} i18nKey={`tags.${tag}`} />
                    </ButtonLink>
                  );
                })}
              </ButtonsGroup>
            )}
            <ButtonsGroup
              minimal
              genericMarginTop
              className={styles["buttons-bottom"]}
            >
              <Button>
                <MdMovie />
                <span>
                  <Trans t={t} i18nKey="headers.bottomButtons.watch" />
                </span>
              </Button>
              {localizedInformation.trailer && (
                <Button
                  onClick={() => {
                    const isMobileDevice: boolean = detectMobileDevice();

                    if (isMobileDevice) {
                      window.open(
                        `https://www.youtube.com/watch?v=${localizedInformation.trailer}`
                      );
                    } else {
                      setTrailerWindowOpen(!trailerWindowOpen);
                    }
                  }}
                >
                  <FaPlay />
                  <span>
                    <Trans t={t} i18nKey="headers.bottomButtons.trailer" />
                  </span>
                </Button>
              )}
            </ButtonsGroup>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default Headers;
