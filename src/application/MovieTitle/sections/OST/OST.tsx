import React, { lazy, ReactElement, useState } from "react";
import { SiSpotify, SiDeezer, SiApplemusic } from "react-icons/si";
import { FaMusic, FaPlay } from "react-icons/fa";
import detectMobileDevice from "@lib/detectMobileDevice";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  Button,
  Card,
  YouTubePlayer,
  ButtonsGroup,
  ButtonExternalLink,
  CardContainer,
} from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import { FunctionComponent } from "@typings/FunctionComponent";
import { IconType } from "react-icons";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import fetchImage from "@lib/fetchImage";
import {
  MovieTitleParams,
  OSTSection,
  StreamingObject,
  SummaryObject,
  TrackInformationObject,
  TracksSection,
  VideoObject,
} from "@typings/movieTitle";
import { useMovieTitleState, useMovieTitleSection } from "@hooks/useMovieTitle";
import { useRouteMatch } from "react-router";
import styles from "./OST.module.scss";
import containerStyle from "../../Containers.module.scss";

interface CoverDimensions {
  coverWidth: number;
  coverHeight: number;
}

const ImageComponent = lazy(() => import("@components/modules/Image/Image"));

const DisplaySVG: FunctionComponent<IconType, { type: string }> = ({
  type,
}) => {
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

const calculateCoverDimensions = (): CoverDimensions => {
  if (window.innerWidth > 400) {
    return { coverWidth: 256, coverHeight: 256 };
  }

  const squarelength: number = Math.ceil((50 / 100) * window.innerWidth);

  return { coverWidth: squarelength, coverHeight: squarelength };
};

const OST: FunctionComponent<HTMLDivElement> = () => {
  const { params } = useRouteMatch<MovieTitleParams>();
  const { sectionLoading, s3Links, title } = useMovieTitleState(params.movieId);
  const { error, data } = useMovieTitleSection<OSTSection>(
    params.movieId,
    "ost"
  );
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");
  const [playerOpen, setPlayerOpen] = useState<boolean>(false);
  const [video, setVideo] = useState<VideoObject>({
    title: "",
    videoID: "",
  });
  const { coverWidth, coverHeight } = calculateCoverDimensions();

  if (sectionLoading || error) {
    return (
      <HandleData
        isFetching={sectionLoading}
        section={s3Links.ost}
        error={error}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <YouTubePlayer
        title={video.title}
        videoID={video.videoID}
        autoPlay
        open={playerOpen}
        setOpen={setPlayerOpen}
        autoClose
      />
      <FlexContainer
        padding
        pageBodyWidth
        column
        className={containerStyle.container}
      >
        <Summary className={containerStyle.summary}>
          {data.summary.map((item: SummaryObject): ReactElement | null => {
            switch (item.type) {
              case "item":
                return (
                  <SummaryItem key={item.to} to={item.to} name={item.name} />
                );

              default:
                return null;
            }
          })}
        </Summary>
        {data.album && (
          <FlexContainer
            column
            id={data.album.id}
            className={containerStyle["generic-margin-top"]}
          >
            <h1>{data.album.name}</h1>
            <FlexContainer allowWrap>
              {data.album.coverURL && (
                <ImageComponent
                  withBackground
                  withBoxShadow
                  placeholder={fetchImage({
                    type: "image",
                    image: data.album.coverURL,
                    width: Math.ceil(coverWidth / 5),
                    height: Math.ceil(coverHeight / 5),
                  })}
                  image={fetchImage({
                    type: "image",
                    image: data.album.coverURL,
                    width: coverWidth,
                    height: coverHeight,
                  })}
                  alt={title}
                  width={coverWidth}
                  height={coverHeight}
                  css={{ margin: "2rem 2rem 0 0" }}
                />
              )}
              <FlexContainer column className={styles["album-headers"]}>
                <h2>{data.album.albumName}</h2>
                <p>{data.album.interpreters.join(", ")}</p>
                <ButtonsGroup minimal>
                  {data.album.streaming.map(
                    (streaming: StreamingObject): ReactElement => {
                      return (
                        <ButtonExternalLink
                          key={streaming.service}
                          href={streaming.album}
                          target="blank"
                        >
                          <DisplaySVG type={streaming.service} />
                          <span>{streaming.service}</span>
                        </ButtonExternalLink>
                      );
                    }
                  )}
                </ButtonsGroup>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        )}
        {data.body.map((body: TracksSection): ReactElement => {
          return (
            <FlexContainer
              column
              key={body.name}
              id={body.id}
              className={containerStyle["generic-margin-top"]}
            >
              <h1>{body.name}</h1>
              <CardContainer direction="column">
                {body.tracks.map(
                  (track: TrackInformationObject): ReactElement => {
                    return (
                      <Card key={track.title} className={styles.card}>
                        <h2>{track.title}</h2>
                        {track.VOTitle && (
                          <h2 className={styles["vo-title"]}>
                            <i>{track.VOTitle}</i>
                          </h2>
                        )}
                        <p>
                          <Trans
                            t={t}
                            i18nKey="ost.duration"
                            values={{ duration: track.duration }}
                          />
                        </p>
                        {track.timecode && (
                          <p>
                            <Trans
                              t={t}
                              i18nKey="ost.timeline"
                              values={{ timeline: track.timecode }}
                            />
                          </p>
                        )}
                        {track.characters && (
                          <p>
                            <Trans
                              t={t}
                              i18nKey="ost.characters"
                              values={{
                                characters: track.characters.join(", "),
                                count: track.characters.length,
                              }}
                            />
                          </p>
                        )}
                        {track.description && (
                          <p>
                            <q className={containerStyle.quotes}>
                              {track.description}
                            </q>
                          </p>
                        )}
                        {Boolean(track.videoID || track.lyrics) && (
                          <ButtonsGroup minimal expand>
                            {track.videoID && (
                              <Button
                                onClick={() => {
                                  const isMobileDevice: boolean =
                                    detectMobileDevice();

                                  if (isMobileDevice) {
                                    window.open(
                                      `https://www.youtube.com/watch?v=${track.videoID}`
                                    );
                                  } else {
                                    setVideo({
                                      title: `${title} - ${track.title}`,
                                      videoID: track.videoID as string,
                                    });
                                    setPlayerOpen(!playerOpen);
                                  }
                                }}
                              >
                                <FaPlay />
                                <span>
                                  <Trans t={t} i18nKey="ost.watchVideo" />
                                </span>
                              </Button>
                            )}
                            {track.lyrics && (
                              <ButtonExternalLink
                                href={track.lyrics}
                                target="blank"
                              >
                                <FaMusic />
                                <span>
                                  <Trans t={t} i18nKey="ost.lyrics" />
                                </span>
                              </ButtonExternalLink>
                            )}
                          </ButtonsGroup>
                        )}
                      </Card>
                    );
                  }
                )}
              </CardContainer>
            </FlexContainer>
          );
        })}
      </FlexContainer>
    </>
  );
};

export default OST;
