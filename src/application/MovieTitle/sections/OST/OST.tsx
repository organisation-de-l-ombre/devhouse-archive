import React, { ReactElement, useState } from "react";
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
import { fetchOptions } from "@lib/api";
import { Trans, useTranslation } from "react-i18next";
import { UseQueryResult, useQuery } from "react-query";
import useLanguage from "@hooks/useLanguage";
import { FunctionComponent } from "@typings/FunctionComponent";
import { IconType } from "react-icons";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import fetchImage from "@lib/fetchImage";
import styles from "./OST.module.scss";
import containerStyle from "../../Containers.module.scss";
import {
  OSTSection,
  ReactMovieElement,
  StreamingObject,
  SummaryObject,
  TrackInformationObject,
  TracksSection,
  VideoObject,
} from "../../types";

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

const OST: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const { t } = useTranslation("pages\\movieTitle\\ost");
  const { isFetching, error, data }: UseQueryResult<OSTSection, Response> =
    useQuery(
      `movie-title/${dataResponse.body.id}/${language}/ost`,
      (): Promise<OSTSection> => {
        return fetch(dataResponse.body.data.ost || "").then(
          (response: Response) => response.json()
        );
      },
      fetchOptions
    );

  const [playerOpen, setPlayerOpen] = useState<boolean>(false);
  const [video, setVideo] = useState<VideoObject>({
    title: "",
    videoID: "",
  });

  if (isFetching || error) {
    return (
      <HandleData
        isFetching={isFetching}
        section={dataResponse.body.data.ost}
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
                <div className={styles["album-cover"]}>
                  <img
                    src={fetchImage({
                      type: "image",
                      width: "256",
                      height: "256",
                      image: data.album.coverURL,
                    })}
                    alt={data.album.albumName}
                  />
                </div>
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
                            i18nKey="duration"
                            values={{ duration: track.duration }}
                          />
                        </p>
                        {track.timecode && (
                          <p>
                            <Trans
                              t={t}
                              i18nKey="timeline"
                              values={{ timeline: track.timecode }}
                            />
                          </p>
                        )}
                        {track.characters && (
                          <p>
                            <Trans
                              t={t}
                              i18nKey="characters"
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
                                      title: `${dataResponse.body.title} - ${track.title}`,
                                      videoID: track.videoID as string,
                                    });
                                    setPlayerOpen(!playerOpen);
                                  }
                                }}
                              >
                                <FaPlay />
                                <span>
                                  <Trans t={t} i18nKey="watchVideo" />
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
                                  <Trans t={t} i18nKey="lyrics" />
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
