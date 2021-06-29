import React, { ReactElement } from "react";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  Card,
  CardContainer,
} from "@components/ui";
import { fetchOptions } from "@lib/api";
import { UseQueryResult, useQuery } from "react-query";
import useLanguage from "@hooks/useLanguage";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import styles from "./Casting.module.scss";
import containerStyle from "../../Containers.module.scss";
import {
  CastingObject,
  CastingSection,
  CharacterObject,
  ReactMovieElement,
  SummaryObject,
} from "../../types";

const Casting: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const {
    isFetching,
    error,
    data,
  }: UseQueryResult<CastingSection, TypeError | Response> = useQuery(
    `movie-title/${dataResponse.body.id}/${language}/casting`,
    (): Promise<CastingSection> => {
      return fetch(dataResponse.body.data.casting || "").then(
        (response: Response) => response.json()
      );
    },
    fetchOptions
  );

  if (isFetching || error) {
    return (
      <HandleData
        isFetching={isFetching}
        section={dataResponse.body.data.casting}
        error={error}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <FlexContainer
      padding
      pageBodyWidth
      column
      className={containerStyle.container}
    >
      <Summary className={containerStyle.summary}>
        {data.summary.map((item: SummaryObject): ReactElement => {
          switch (item.type) {
            case "item":
              return (
                <SummaryItem key={item.to} to={item.to} name={item.name} />
              );

            default:
              return <></>;
          }
        })}
      </Summary>
      {data.body.map((section: CastingObject): ReactElement => {
        return (
          <FlexContainer
            column
            key={section.name}
            id={section.id}
            className={containerStyle["generic-margin-top"]}
          >
            <h1>{section.name}</h1>
            <CardContainer direction="inline">
              {section.items.map((character: CharacterObject): ReactElement => {
                return (
                  <Card
                    key={`${character.name}-${character.role}`}
                    className={styles.card}
                  >
                    <img
                      src={
                        character.imageURL
                          ? character.imageURL
                          : "/pictures/referencing/cast-bust.png"
                      }
                      alt={character.name}
                    />
                    <FlexContainer column>
                      <h2>{character.name}</h2>
                      <p>{character.role}</p>
                    </FlexContainer>
                  </Card>
                );
              })}
            </CardContainer>
          </FlexContainer>
        );
      })}
    </FlexContainer>
  );
};

export default Casting;
