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
      </Summary>
      <DetailledText id="presentation">
        <h1>Présentation</h1>
        <p>{movieObject.movie.presentation}</p>
      </DetailledText>
      <DetailledText id="detailled-summary">
        <h1>Résumé détaillé</h1>
        {movieObject.movie.detailledSummary.map(
          (description: string): React.ReactElement => {
            return <p>{description}</p>;
          }
        )}
      </DetailledText>
      <DetailledText id="reviews">
        <h1>Critiques</h1>
        <p>{movieObject.movie.reviews}</p>
      </DetailledText>
    </FlexContainer>
  );
};

export default MoviePage;
