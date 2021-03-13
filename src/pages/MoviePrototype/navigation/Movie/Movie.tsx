import React from "react";
import styles from "./Movie.module.scss";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import listStyles from "../../../../components/List/List.module.scss";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import {
  Item,
  SubSummary,
  Summary,
} from "../../../../components/Summary/Summary";
import DetailledText from "../../../../components/DetailledText/DetailledText";
import movieObject from "../../prototype.json";
import List from "../../../../components/List/List";

const MoviePage = (): React.ReactElement => {
  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${styles.container}`}
    >
      <Summary className={styles.summary}>
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
        text={movieObject.movie.presentation}
      />
      <DetailledText
        id="detailled-summary"
        title="Résumé détaillé"
        text={movieObject.movie.detailledSummary}
      />
      <DetailledText
        id="reviews"
        title="Critiques"
        text={movieObject.movie.reviews}
      />
      <DetailledText
        id="references"
        title="Références"
        text={movieObject.movie.references}
      />
      <DetailledText id="universe">
        <h1>Univers de Raiponce</h1>
        {movieObject.movie.universe.map(
          (element: {
            title: string;
            id: string;
            text: string;
          }): React.ReactElement => {
            return (
              <DetailledText id={element.id} className={styles["sub-groups"]}>
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
          items={movieObject.movie.distinctions}
        />
      </DetailledText>
    </FlexContainer>
  );
};

export default MoviePage;
