import React from "react";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  SubSummary,
  DetailedText,
  List,
} from "@components/ui";
import { useQuery, UseQueryResult } from "react-query";
import { fetchOptions } from "@lib/api";
import { useTranslation } from "react-i18next";
import { Suspense } from "@components/modules";
import { useLanguage } from "@hooks/Language";
import containerStyle from "../../Containers.module.scss";
import {
  BodyContent,
  GenericSection,
  ReactMovieElement,
  SummaryObject,
} from "../../types";
import SectionEmpty from "../../modules/SectionEmpty/SectionEmpty";

const MovieSection: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const { t } = useTranslation("pages\\movieTitle\\root");
  const { isFetching, data }: UseQueryResult<GenericSection> = useQuery(
    `movie-title_${dataResponse.body.id}_${language}_characters`,
    (): Promise<GenericSection> => {
      return fetch(
        dataResponse.body.data.characters || ""
      ).then((response: Response) => response.json());
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

              case "subitem":
                return (
                  <SubSummary key={item.to} to={item.to} name={item.name}>
                    {item.items.map(
                      (subItem: SummaryObject): React.ReactElement => {
                        switch (subItem.type) {
                          case "item":
                            return (
                              <SummaryItem
                                key={subItem.to}
                                to={subItem.to}
                                name={subItem.name}
                              />
                            );

                          default:
                            return <></>;
                        }
                      }
                    )}
                  </SubSummary>
                );

              default:
                return <></>;
            }
          }
        )}
      </Summary>
      {data.body.map(
        (item: BodyContent): React.ReactElement => {
          switch (item.type) {
            case "text":
              return (
                <DetailedText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  <p>{item.text}</p>
                </DetailedText>
              );

            case "textlist":
              return (
                <DetailedText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  {item.texts.map(
                    (text: string): React.ReactElement => (
                      <p key={text}>{text}</p>
                    )
                  )}
                </DetailedText>
              );

            case "list":
              return (
                <DetailedText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  <List className={containerStyle.list}>
                    {item.items.map(
                      (listItem: string): React.ReactElement => (
                        <li key={listItem}>{listItem}</li>
                      )
                    )}
                  </List>
                </DetailedText>
              );

            case "subsection":
              return (
                <DetailedText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  {item.body.map(
                    (subItem: BodyContent): React.ReactElement => {
                      switch (subItem.type) {
                        case "text":
                          return (
                            <DetailedText
                              key={subItem.name}
                              className={containerStyle["sub-groups"]}
                            >
                              <h2 id={subItem.id}>{subItem.name}</h2>
                              <p>{subItem.text}</p>
                            </DetailedText>
                          );

                        case "textlist":
                          return (
                            <DetailedText
                              key={subItem.name}
                              className={containerStyle["sub-groups"]}
                            >
                              <h2 id={subItem.id}>{subItem.name}</h2>
                              {subItem.texts.map(
                                (text: string): React.ReactElement => (
                                  <p key={text}>{text}</p>
                                )
                              )}
                            </DetailedText>
                          );

                        case "list":
                          return (
                            <DetailedText
                              key={item.name}
                              className={containerStyle["sub-groups"]}
                            >
                              <h2 id={subItem.id}>{subItem.name}</h2>
                              <List className={containerStyle.list}>
                                {subItem.items.map(
                                  (listItem: string): React.ReactElement => (
                                    <li key={listItem}>{listItem}</li>
                                  )
                                )}
                              </List>
                            </DetailedText>
                          );

                        default:
                          return <></>;
                      }
                    }
                  )}
                </DetailedText>
              );

            default:
              return <></>;
          }
        }
      )}
    </FlexContainer>
  );
};

export default MovieSection;
