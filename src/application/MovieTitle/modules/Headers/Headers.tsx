import React, { useCallback, useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { MdMovie, MdEdit } from "react-icons/md";
import { BsStarFill } from "react-icons/bs";
import { ImHeart } from "react-icons/im";
import { IoMdShareAlt } from "react-icons/io";
import { calculateDuration, detectMobileDevice } from "@lib/utils";
import useLanguage from "@hooks/useLanguage";
import {
  FlexContainer,
  ButtonLink,
  Button,
  ButtonsGroup,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import loadable from "@loadable/component";
import { useLocation } from "react-router";
import { MovieTitleComponent } from "@typings/movieTitle";
import styles from "../../Headers.module.scss";
import containerStyle from "../../Containers.module.scss";
import Background from "../Background/Background";

const YouTubePlayer = loadable(
  () => import("@components/ui/YouTubePlayer/YouTubePlayer")
);
const ShareModal = loadable(() => import("../ShareModal/ShareModal"));
const Poster = loadable(() => import("../Poster/Poster"));

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
  const [mainInformation, setMainInformation] = useState<string[]>([]);
  const isMobileDevice = detectMobileDevice();
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const shareMovie = useCallback((): void => {
    setShareModalOpen(true);
  }, []);

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

    temp.push(dataResponse.case as string);

    setMainInformation(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

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
      {!isMobileDevice && (
        <ShareModal
          open={shareModalOpen}
          setOpen={setShareModalOpen}
          dataResponse={dataResponse}
        />
      )}
      <FlexContainer horizontallyCentered className={styles["headers-root"]}>
        <Background dataResponse={dataResponse} usage="headers" />
        <FlexContainer pageBodyWidth allowWrap className={styles.headers}>
          {localizedInformation.poster && (
            <Poster dataResponse={dataResponse} />
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
              <h2>
                {mainInformation
                  .map((item: string): string =>
                    item === dataResponse.case ? tMedia(`cases.${item}`) : item
                  )
                  .join(" • ")}
              </h2>
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
                aria-label={t("headers.topButtons.edit")}
                title={t("headers.topButtons.edit")}
              >
                <MdEdit css={{ transform: "scale(1.25)" }} />
              </button>
              <button
                type="button"
                aria-label={t("headers.topButtons.share")}
                title={t("headers.topButtons.share")}
                onClick={shareMovie}
              >
                <IoMdShareAlt css={{ transform: "scale(1.5)" }} />
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
            {(dataResponse.data.watch || localizedInformation.trailer) && (
              <ButtonsGroup
                minimal
                genericMarginTop
                className={styles["buttons-bottom"]}
              >
                {dataResponse.data.watch && (
                  <ButtonLink to={`/movies/title/${dataResponse.id}/watch`}>
                    <MdMovie />
                    <span>
                      <Trans t={t} i18nKey="headers.bottomButtons.watch" />
                    </span>
                  </ButtonLink>
                )}
                {localizedInformation.trailer && (
                  <Button
                    onClick={() => {
                      if (isMobileDevice) {
                        window.open(
                          `https://www.youtube.com/watch?v=${localizedInformation.trailer}`
                        );
                      } else {
                        setTrailerWindowOpen(true);
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
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </>
  );
};

export default Headers;
