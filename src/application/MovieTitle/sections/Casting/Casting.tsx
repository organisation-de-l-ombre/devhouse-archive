import React from "react";
import { FlexContainer, Summary, SummaryItem, Card } from "@components/ui";
import bust from "@assets/pictures/bust.png";
import styles from "./Casting.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import {
  CastingObject,
  CharacterObject,
  ReactMovieElement,
  SummaryObject,
} from "../../types";

const CastingSection: ReactMovieElement = ({ dataResponse }) => {
  const { casting } = dataResponse;

  if (!casting) {
    return <></>;
  }

  return (
    <FlexContainer className={containerStyle.container}>
      <Summary className={containerStyle.summary}>
        {casting.summary.map(
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
      {casting.body.map(
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
