import React, { ReactElement } from "react";
import loadable from "@loadable/component";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  MovieTitleComponent,
  TechnicalSpecsSection,
} from "@typings/movieTitle";
import { FlexContainer } from "@components/ui";
import { Trans, useTranslation } from "react-i18next";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import classnames from "classnames";
import { fetchImage } from "@lib/utils";
import { useMovieTitleSection } from "@hooks/useMovieTitle";
import useLanguage from "@hooks/useLanguage";
import containerStyle from "../../Containers.module.scss";
import styles from "./TechnicalSpecs.module.scss";

const ImageComponent = loadable(
  () => import("@components/modules/Image/Image")
);

const TechnicalSpecs: MovieTitleComponent = ({ dataResponse }) => {
  const { language } = useLanguage();
  const data = useMovieTitleSection<TechnicalSpecsSection>(
    dataResponse.id,
    "technical-specs"
  );
  const { t } = useTranslation("pages\\movieTitle\\movieTitle");
  const { t: tMedia } = useTranslation("media\\media");

  if (!data) {
    return null;
  }

  if (data.sectionStatus === "loading" || data.sectionStatus === "error") {
    return <HandleData dataResponse={data} />;
  }

  const { presentation, movieSpecs } = data;

  return (
    <FlexContainer
      padding
      pageBodyWidth
      column
      className={containerStyle.container}
    >
      <FlexContainer
        column
        horizontallyCentered
        className={styles.presentation}
      >
        {presentation.movieLogo && (
          <ImageComponent
            placeholder={fetchImage({
              image: presentation.movieLogo,
              width: Math.ceil(270 / 5),
              height: Math.ceil(155 / 5),
            })}
            image={fetchImage({
              image: presentation.movieLogo,
              width: 270,
              height: 155,
            })}
            alt={dataResponse.localizedInformation.title}
            width={270}
            height={155}
            css={{ marginBottom: "2rem" }}
          />
        )}
        <table>
          <tbody>
            <tr>
              <td>
                <Trans t={t} i18nKey="technicalSpecs.presentation.title" />
              </td>
              <td>{presentation.title}</td>
            </tr>
            {presentation.VOTitle && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="technicalSpecs.presentation.VOTitle" />
                </td>
                <td>{presentation.VOTitle}</td>
              </tr>
            )}
            <tr>
              <td>
                <Trans
                  t={t}
                  i18nKey="technicalSpecs.presentation.originalCountry"
                />
              </td>
              <td>{presentation.originalCountry}</td>
            </tr>
            {presentation.duration && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="technicalSpecs.presentation.duration" />
                </td>
                <td>{presentation.duration}</td>
              </tr>
            )}
            <tr>
              <td>
                <Trans t={t} i18nKey="technicalSpecs.presentation.type" />
              </td>
              <td>
                {presentation.type
                  .map((tag: string): string => tMedia(`tags.${tag}`))
                  .join(", ")}
              </td>
            </tr>
            <tr>
              <td>
                <Trans t={t} i18nKey="technicalSpecs.presentation.case" />
              </td>
              <td>{presentation.case}</td>
            </tr>
            <tr>
              <td>
                <Trans
                  t={t}
                  i18nKey="technicalSpecs.presentation.distributors"
                  values={{ count: presentation.distributors.length }}
                />
              </td>
              <td>{presentation.distributors.join(", ")}</td>
            </tr>
            {presentation.productionStart && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.productionStart"
                  />
                </td>
                <td>{presentation.productionStart}</td>
              </tr>
            )}
            {presentation.productionRelease && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.productionRelease"
                  />
                </td>
                <td>{presentation.productionRelease}</td>
              </tr>
            )}
            {presentation.releaseDate && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.releaseDate"
                  />
                </td>
                <td>
                  {new Intl.DateTimeFormat(language).format(
                    new Date(presentation.releaseDate)
                  )}
                </td>
              </tr>
            )}
            {presentation.budget && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="technicalSpecs.presentation.budget" />
                </td>
                <td>{presentation.budget}</td>
              </tr>
            )}
            {presentation.boxOffice && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.boxOffice"
                  />
                </td>
                <td>{presentation.boxOffice}</td>
              </tr>
            )}
            {presentation.directors && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.directors"
                    values={{ count: presentation.directors.length }}
                  />
                </td>
                <td>{presentation.directors.join(", ")}</td>
              </tr>
            )}
            {presentation.producers && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.producers"
                    values={{ count: presentation.producers.length }}
                  />
                </td>
                <td>{presentation.producers.join(", ")}</td>
              </tr>
            )}
            {presentation.screenWriters && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.screenWriters"
                    values={{ count: presentation.screenWriters.length }}
                  />
                </td>
                <td>{presentation.screenWriters.join(", ")}</td>
              </tr>
            )}
            {presentation.mainActors && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="technicalSpecs.presentation.mainActors"
                    values={{ count: presentation.mainActors.length }}
                  />
                </td>
                <td>{presentation.mainActors.join(", ")}</td>
              </tr>
            )}
          </tbody>
        </table>
        {presentation.movieChronologicalFranchise && (
          <div className={styles.franchise}>
            <h1>
              <Trans
                t={t}
                i18nKey="technicalSpecs.presentation.movieChronologicalFranchise"
              />
            </h1>
            <FlexContainer>
              {presentation.movieChronologicalFranchise.previous && (
                <FlexContainer
                  verticallyCentered
                  className={`${styles.element} ${styles.previous}`}
                >
                  <FlexContainer fullCentered>
                    <MdKeyboardArrowLeft />
                  </FlexContainer>
                  <span>
                    {presentation.movieChronologicalFranchise.previous.title}
                    {presentation.movieChronologicalFranchise.previous.year &&
                      ` (${presentation.movieChronologicalFranchise.previous.year})`}
                  </span>
                </FlexContainer>
              )}
              {presentation.movieChronologicalFranchise.next && (
                <FlexContainer
                  verticallyCentered
                  className={`${styles.element} ${styles.next}`}
                >
                  <span>
                    {presentation.movieChronologicalFranchise.next.title}
                    {presentation.movieChronologicalFranchise.next.year &&
                      ` (${presentation.movieChronologicalFranchise.next.year})`}
                  </span>
                  <FlexContainer fullCentered>
                    <MdKeyboardArrowRight />
                  </FlexContainer>
                </FlexContainer>
              )}
            </FlexContainer>
          </div>
        )}
        {presentation.movieLogicalFranchise && (
          <div className={styles.franchise}>
            <h1>
              <Trans
                t={t}
                i18nKey="technicalSpecs.presentation.movieLogicalFranchise"
              />
            </h1>
            <FlexContainer>
              {presentation.movieLogicalFranchise.previous && (
                <FlexContainer
                  verticallyCentered
                  className={`${styles.element} ${styles.previous}`}
                >
                  <FlexContainer fullCentered>
                    <MdKeyboardArrowLeft />
                  </FlexContainer>
                  <span>
                    {presentation.movieLogicalFranchise.previous.title}
                    {presentation.movieLogicalFranchise.previous.year &&
                      ` (${presentation.movieLogicalFranchise.previous.year})`}
                  </span>
                </FlexContainer>
              )}
              {presentation.movieLogicalFranchise.next && (
                <FlexContainer
                  verticallyCentered
                  className={`${styles.element} ${styles.next}`}
                >
                  <span>
                    {presentation.movieLogicalFranchise.next.title}
                    {presentation.movieLogicalFranchise.next.year &&
                      ` (${presentation.movieLogicalFranchise.next.year})`}
                  </span>
                  <FlexContainer fullCentered>
                    <MdKeyboardArrowRight />
                  </FlexContainer>
                </FlexContainer>
              )}
            </FlexContainer>
          </div>
        )}
      </FlexContainer>
      {movieSpecs && (
        <FlexContainer
          column
          className={classnames(
            containerStyle["generic-margin-top"],
            styles["movie-specs"]
          )}
        >
          <h1>
            <Trans t={t} i18nKey="technicalSpecs.movieSpecs.sectionTitle" />
          </h1>
          <table>
            <tbody>
              {Object.keys(movieSpecs).map(
                (rootKey: string): ReactElement | undefined => {
                  const key = rootKey as keyof typeof movieSpecs;

                  return (
                    movieSpecs[key] && (
                      <tr key={key}>
                        <td>
                          <Trans
                            t={t}
                            i18nKey={`technicalSpecs.movieSpecs.${key}`}
                          />
                        </td>
                        <td>
                          <ul>
                            {movieSpecs[key]?.map(
                              (item: string): ReactElement => {
                                return <li key={item}>{item}</li>;
                              }
                            )}
                          </ul>
                        </td>
                      </tr>
                    )
                  );
                }
              )}
            </tbody>
          </table>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TechnicalSpecs;
