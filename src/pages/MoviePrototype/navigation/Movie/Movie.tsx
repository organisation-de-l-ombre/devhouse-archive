import React from "react";
import styles from "./Movie.module.scss";
import containerStyle from "../../Containers.module.scss";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import listStyles from "../../../../components/ui/List/List.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import {
  Item,
  SubSummary,
  Summary,
} from "../../../../components/ui/Summary/Summary";
import DetailledText from "../../../../components/ui/DetailledText/DetailledText";
import List from "../../../../components/ui/List/List";
import { MovieObject, UniverseObject } from "../../Types";

const MoviePage: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: MovieObject }
> = ({ dataResponse }) => {
  const { movie } = dataResponse;

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${styles.container} ${containerStyle.container}`}
    >
      <Summary className={containerStyle.summary}>
        <Item to="#presentation" name="Présentation" />
        <Item to="#detailled-summary" name="Résumé détaillé" />
        <Item to="#reviews" name="Critiques" />
        <Item to="#references" name="Références" />
        <SubSummary to="#universe" name="Univers de Raiponce">
          <Item to="#universe_short" name="Court-métrage" />
          <Item to="#universe_tvfilm" name="Téléfilm" />
          <Item to="#universe_serie" name="Série télévisée" />
        </SubSummary>
        <Item to="#distinctions" name="Oscars / Nominations" />
      </Summary>
      <DetailledText
        id="presentation"
        title="Présentation"
        text={movie.presentation}
      />
      <DetailledText
        id="detailled-summary"
        title="Résumé détaillé"
        text={movie.detailledSummary}
      />
      <DetailledText id="reviews" title="Critiques" text={movie.reviews} />
      <DetailledText
        id="references"
        title="Références"
        text={movie.references}
      />
      <DetailledText id="universe">
        <h1>Univers de Raiponce</h1>
        {movie.universe.map(
          (element: UniverseObject): React.ReactElement => {
            return (
              <DetailledText
                key={element.title}
                id={element.id}
                className={styles["sub-groups"]}
              >
                <h2>{element.title}</h2>
                <p>{element.text}</p>
              </DetailledText>
            );
          }
        )}
      </DetailledText>
      <DetailledText id="distinctions">
        <h1>Oscars / Nominations</h1>
        <List
          className={`${listStyles.list} ${styles["list-margin"]}`}
          items={movie.distinctions}
        />
      </DetailledText>
    </FlexContainer>
  );
};

export default MoviePage;
