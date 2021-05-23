import React, { ReactElement } from "react";
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
import useLanguage from "@hooks/useLanguage";
import HandleData from "@application/MovieTitle/modules/HandleData/HandleData";
import containerStyle from "../../Containers.module.scss";
import {
  BodyContent,
  GenericSection,
  ReactMovieElement,
  SummaryObject,
} from "../../types";

const Characters: ReactMovieElement = ({ dataResponse }) => {
  const { language } = useLanguage();
  const {
    isFetching,
    error,
    data,
  }: UseQueryResult<GenericSection, Response> = useQuery(
    `movie-title/${dataResponse.body.id}/${language}/characters`,
    (): Promise<GenericSection> => {
      return fetch(
        dataResponse.body.data.characters || ""
      ).then((response: Response) => response.json());
    },
    fetchOptions
  );

  if (isFetching || error) {
    return (
      <HandleData
        isFetching={isFetching}
        section={dataResponse.body.data.characters}
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
        {data.summary.map(
          (item: SummaryObject): ReactElement => {
            switch (item.type) {
              case "item":
                return (
                  <SummaryItem key={item.to} to={item.to} name={item.name} />
                );

              case "subitem":
                return (
                  <SubSummary key={item.to} to={item.to} name={item.name}>
                    {item.items.map(
                      (subItem: SummaryObject): ReactElement => {
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
        (item: BodyContent): ReactElement => {
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
                    (text: string): ReactElement => (
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
                      (listItem: string): ReactElement => (
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
                    (subItem: BodyContent): ReactElement => {
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
                                (text: string): ReactElement => (
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
                                  (listItem: string): ReactElement => (
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

export default Characters;
