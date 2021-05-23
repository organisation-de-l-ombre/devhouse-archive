import React, { ReactElement } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  ReactMovieElement,
  TechnicalSpecsSection,
} from "@application/MovieTitle/types";
import { FlexContainer } from "@components/ui";
import useLanguage from "@hooks/useLanguage";
import { Trans, useTranslation } from "react-i18next";
import { useQuery, UseQueryResult } from "react-query";
import fetchOptions from "@lib/api/fetchOptions";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import classnames from "classnames";
import styles from "./TechnicalSpecs.module.scss";
import containerStyle from "../../Containers.module.scss";

const TechnicalSpecs: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const { t } = useTranslation("pages\\movieTitle\\technicalSpecs");
  const { t: tTags } = useTranslation("pages\\movieTitle\\tags");
  const {
    isFetching,
    error,
    data,
  }: UseQueryResult<TechnicalSpecsSection, Response> = useQuery(
    `movie-title/${dataResponse.body.id}/technical-specs`,
    (): Promise<TechnicalSpecsSection> => {
      return fetch(
        dataResponse.body.data.technicalSpecs || ""
      ).then((response: Response) => response.json());
    },
    fetchOptions
  );

  if (isFetching) {
    return (
      <HandleData
        isFetching={isFetching}
        section={dataResponse.body.data.technicalSpecs}
        error={error}
      />
    );
  }

  if (!data) {
    return null;
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
          <div className={styles.logo}>
            <img
              src={presentation.movieLogo}
              alt={`Movie logo of ${presentation.title}`}
              draggable={false}
            />
          </div>
        )}
        <table>
          <tbody>
            <tr>
              <td>
                <Trans t={t} i18nKey="presentation.title" />
              </td>
              <td>{presentation.title}</td>
            </tr>
            {presentation.VOTitle && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="presentation.VOTitle" />
                </td>
                <td>{presentation.VOTitle}</td>
              </tr>
            )}
            <tr>
              <td>
                <Trans t={t} i18nKey="presentation.originalCountry" />
              </td>
              <td>{presentation.originalCountry}</td>
            </tr>
            {presentation.duration && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="presentation.duration" />
                </td>
                <td>{presentation.duration}</td>
              </tr>
            )}
            <tr>
              <td>
                <Trans t={t} i18nKey="presentation.type" />
              </td>
              <td>
                {presentation.type
                  .map((tag: string): string => tTags(tag))
                  .join(", ")}
              </td>
            </tr>
            <tr>
              <td>
                <Trans t={t} i18nKey="presentation.case" />
              </td>
              <td>{presentation.case}</td>
            </tr>
            <tr>
              <td>
                <Trans
                  t={t}
                  i18nKey="presentation.distributors"
                  values={{ count: presentation.distributors.length }}
                />
              </td>
              <td>{presentation.distributors.join(", ")}</td>
            </tr>
            {presentation.productionStart && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="presentation.productionStart" />
                </td>
                <td>{presentation.productionStart}</td>
              </tr>
            )}
            {presentation.productionRelease && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="presentation.productionRelease" />
                </td>
                <td>{presentation.productionRelease}</td>
              </tr>
            )}
            {presentation.releaseDate && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="presentation.releaseDate" />
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
                  <Trans t={t} i18nKey="presentation.budget" />
                </td>
                <td>{presentation.budget}</td>
              </tr>
            )}
            {presentation.boxOffice && (
              <tr>
                <td>
                  <Trans t={t} i18nKey="presentation.boxOffice" />
                </td>
                <td>{presentation.boxOffice}</td>
              </tr>
            )}
            {presentation.directors && (
              <tr>
                <td>
                  <Trans
                    t={t}
                    i18nKey="presentation.directors"
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
                    i18nKey="presentation.producers"
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
                    i18nKey="presentation.screenWriters"
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
                    i18nKey="presentation.mainActors"
                    values={{ count: presentation.mainActors.length }}
                  />
                </td>
                <td>{presentation.mainActors.join(", ")}</td>
              </tr>
            )}
          </tbody>
        </table>
        {presentation.movieChronologicalFranchise && (
          <div>
            <h1>
              <Trans t={t} i18nKey="presentation.movieChronologicalFranchise" />
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
          <FlexContainer column>
            <h1>
              <Trans t={t} i18nKey="presentation.movieLogicalFranchise" />
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
          </FlexContainer>
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
            <Trans t={t} i18nKey="movieSpecs.sectionTitle" />
          </h1>
          <table>
            <tbody>
              {Object.keys(movieSpecs).map((rootKey: string):
                | ReactElement
                | undefined => {
                const key = rootKey as keyof typeof movieSpecs;

                return (
                  movieSpecs[key] && (
                    <tr key={key}>
                      <td>
                        <Trans t={t} i18nKey={`movieSpecs.${key}`} />
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
              })}
            </tbody>
          </table>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default TechnicalSpecs;
