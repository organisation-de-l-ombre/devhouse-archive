import { useMovieTitleSection } from "@hooks/useMovieTitle";
import {
  MovieTitleComponent,
  WatchSection,
  WatchService,
} from "@typings/movieTitle";
import React, { ReactElement } from "react";
import { FlexContainer, ButtonExternalLink } from "@components/ui";
import loadable from "@loadable/component";
import { Trans, useTranslation } from "react-i18next";
import { FunctionComponent } from "@typings/FunctionComponent";
import { fetchImage } from "@lib/utils";
import { css } from "@emotion/react";
import Background from "../../modules/Background/Background";
import HandleData from "../../modules/HandleData/HandleData";
import styles from "../../Headers.module.scss";

interface ServiceSectionProps {
  type: "streaming" | "vod";
  dataResponse: WatchService[];
}

const Poster = loadable(() => import("../../modules/Poster/Poster"));

const ServiceSection: FunctionComponent<HTMLDivElement, ServiceSectionProps> =
  ({ type, dataResponse }) => {
    const { t } = useTranslation("pages\\movieTitle\\movieTitle");
    const { t: tMedia } = useTranslation("media\\media");

    return (
      <FlexContainer column css={{ marginTop: "2rem" }}>
        <h1 css={{ fontSize: "25px" }}>
          <Trans
            t={t}
            i18nKey={`watch.${type}`}
            values={{ count: dataResponse.length }}
          />
        </h1>
        <div className={styles["service-section"]}>
          {dataResponse.map(({ service, link }: WatchService): ReactElement => {
            return (
              <ButtonExternalLink href={link} target="blank">
                <img
                  src={fetchImage({
                    image: `international-media-referencing/amelia-data-public/media/watch-services/${service}`,
                    width: 40,
                    height: service === "youtube" ? 28 : 40,
                    format: "webp",
                  })}
                  alt={tMedia(`watchServices.${service}`)}
                  css={css`
                    width: "40px";
                    height: ${service === "youtube" ? "28px" : "40px"};
                    ${service !== "youtube" && "border-radius: 10px;"}
                  `}
                />
                <span>
                  <Trans t={tMedia} i18nKey={`watchServices.${service}`} />
                </span>
              </ButtonExternalLink>
            );
          })}
        </div>
      </FlexContainer>
    );
  };

const Watch: MovieTitleComponent = ({ dataResponse }) => {
  const data = useMovieTitleSection<WatchSection>(dataResponse.id, "watch");
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");

  if (!data) {
    return null;
  }

  if (data.sectionStatus === "loading" || data.sectionStatus === "error") {
    return <HandleData dataResponse={data} />;
  }

  const { localizedInformation } = dataResponse;

  return (
    <FlexContainer
      horizontallyCentered
      css={{ backgroundColor: "var(--media-headers-background-color)" }}
    >
      <Background dataResponse={dataResponse} usage="watch" />
      <FlexContainer
        pageBodyWidth
        allowWrap
        css={{ zIndex: 1, height: "calc(100% - 4rem)" }}
        className={styles.headers}
      >
        {localizedInformation.poster && <Poster dataResponse={dataResponse} />}
        <FlexContainer column className={styles["headers-content"]}>
          <h1>{`${localizedInformation.title} (${dataResponse.title})`}</h1>
          <p>
            <Trans
              t={t}
              i18nKey="watch.description"
              values={{ title: localizedInformation.title }}
            />
          </p>
          {data.streaming && (
            <ServiceSection type="streaming" dataResponse={data.streaming} />
          )}
          {data.vod && <ServiceSection type="vod" dataResponse={data.vod} />}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Watch;
