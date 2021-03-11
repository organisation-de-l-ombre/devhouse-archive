import React from "react";
import styles from "./Movie.module.scss";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import { Item, Summary } from "../../../../components/Summary/Summary";
import DetailledText from "../../../../components/DetailledText/DetailledText";
import movieObject from "../../prototype.json";

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
        <Item to="#universe" name="Univers de Raiponce" />
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
          (element: { title: string; text: string }): React.ReactElement => {
            return (
              <DetailledText className={styles["sub-groups"]}>
                <h2>{element.title}</h2>
                <p>{element.text}</p>
              </DetailledText>
            );
          }
        )}
      </DetailledText>
    </FlexContainer>
  );
};

export default MoviePage;
