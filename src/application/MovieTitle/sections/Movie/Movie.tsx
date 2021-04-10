import React from "react";
import {
  FlexContainer,
  Summary,
  SummaryItem,
  SubSummary,
  DetailedText,
  List,
} from "@components/ui";
import containerStyle from "../../Containers.module.scss";
import { BodyContent, ReactMovieElement, SummaryObject } from "../../types";

const MovieSection: ReactMovieElement = ({ dataResponse }) => {
  const { movie } = dataResponse;

  return (
    <FlexContainer className={containerStyle.container}>
      <Summary className={containerStyle.summary}>
        {movie.summary.map(
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
      {movie.body.map(
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
                  <List className={containerStyle["list-margin"]}>
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
                              <List className={containerStyle["list-margin"]}>
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
