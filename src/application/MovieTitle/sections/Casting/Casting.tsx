import React from "react";
import { FlexContainer, Summary, SummaryItem, Card } from "@components/ui";
import bust from "@assets/pictures/bust.png";
import fetchOptions from "@lib/api/fetchOptions";
import { useTranslation } from "react-i18next";
import { UseQueryResult, useQuery } from "react-query";
import styles from "./Casting.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import {
  CastingObject,
  CastingSection as CastingSectionType,
  CharacterObject,
  ReactMovieElement,
  SummaryObject,
} from "../../types";
import SectionEmpty from "../../modules/SectionEmpty/SectionEmpty";
import { Suspense } from "../../../../components/modules";

const CastingSection: ReactMovieElement = ({ dataResponse }) => {
  const { t } = useTranslation("pages\\movieTitle\\root");
  const { isFetching, data }: UseQueryResult<CastingSectionType> = useQuery(
    `movie-title/${dataResponse.id}/casting`,
    (): Promise<CastingSectionType> => {
      return fetch(dataResponse.data.casting || "").then((response: Response) =>
        response.json()
      );
    },
    fetchOptions
  );

  if (isFetching) {
    return <Suspense minHeight customText={t("fetchingData")} />;
  }

  if (!data) {
    return <SectionEmpty />;
  }

  return (
    <FlexContainer className={containerStyle.container}>
      <Summary className={containerStyle.summary}>
        {data.summary.map(
          (item: SummaryObject): React.ReactElement => {
            switch (item.type) {
              case "item":
                return (
                  <SummaryItem key={item.to} to={item.to} name={item.name} />
                );

              default:
                return <></>;
            }
          }
        )}
      </Summary>
      {data.body.map(
        (section: CastingObject): React.ReactElement => {
          return (
            <FlexContainer
              key={section.name}
              id={section.id}
              className={`${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
            >
              <h1>{section.name}</h1>
              <FlexContainer className={styles["cards-container"]}>
                {section.items.map(
                  (character: CharacterObject): React.ReactElement => {
                    return (
                      <Card
                        key={`${character.name}-${character.role}`}
                        className={styles["card-container"]}
                      >
                        <img
                          src={character.imageURL ? character.imageURL : bust}
                          alt={character.name}
                        />
                        <div>
                          <h2>{character.name}</h2>
                          <p>{character.role}</p>
                        </div>
                      </Card>
                    );
                  }
                )}
              </FlexContainer>
            </FlexContainer>
          );
        }
      )}
    </FlexContainer>
  );
};

export default CastingSection;
