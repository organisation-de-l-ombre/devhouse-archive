import React from "react";
import styles from "./Casting.module.scss";
import containerStyle from "../../Containers.module.scss";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import {
  CastingObject,
  CharacterObject,
  MovieObject,
  SummaryObject,
} from "../../Types";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import { Item, Summary } from "../../../../components/ui/Summary/Summary";
import Card from "../../../../components/ui/Card/Card";
import bust from "../../../../assets/pictures/bust.png";

const Casting: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${containerStyle.container}`}
    >
      <Summary className={containerStyle.summary}>
        {dataResponse.casting.summary.map(
          (item: SummaryObject): React.ReactElement => {
            switch (item.type) {
              case "item":
                return <Item key={item.name} to={item.to} name={item.name} />;
              default:
                return <></>;
            }
          }
        )}
      </Summary>
      {dataResponse.casting.body.map(
        (casting: CastingObject): React.ReactElement => {
          return (
            <FlexContainer
              key={casting.id}
              id={casting.id}
              className={`${flexContainerStyles.container} ${globalStyles.column} ${containerStyle["generic-margin-top"]}`}
            >
              <h1>{casting.title}</h1>
              <FlexContainer
                className={`${flexContainerStyles.container} ${styles["cards-container"]}`}
              >
                {casting.items.map(
                  (character: CharacterObject): React.ReactElement => {
                    return (
                      <Card
                        key={character.name}
                        className={`${cardStyles.container} ${styles["card-container"]}`}
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

export default Casting;
