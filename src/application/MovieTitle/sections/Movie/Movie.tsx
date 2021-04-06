import React from "react";
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
import { BodyContent, S3DataResponse, SummaryObject } from "../../types";

const MovieSection: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { dataResponse: S3DataResponse }
> = ({ dataResponse }) => {
  const { movie } = dataResponse;

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${containerStyle.container}`}
    >
      <Summary className={containerStyle.summary}>
        {movie.summary.map(
          (item: SummaryObject): React.ReactElement => {
            switch (item.type) {
              case "item":
                return <Item key={item.to} to={item.to} name={item.name} />;

              case "subitem":
                return (
                  <SubSummary key={item.to} to={item.to} name={item.name}>
                    {item.items.map(
                      (subItem: SummaryObject): React.ReactElement => {
                        switch (subItem.type) {
                          case "item":
                            return (
                              <Item
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
                <DetailledText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  <p>{item.text}</p>
                </DetailledText>
              );

            case "textlist":
              return (
                <DetailledText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  {item.texts.map(
                    (text: string): React.ReactElement => (
                      <p key={text}>{text}</p>
                    )
                  )}
                </DetailledText>
              );

            case "list":
              return (
                <DetailledText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  <List
                    className={`${listStyles.list} ${containerStyle["list-margin"]}`}
                  >
                    {item.items.map(
                      (listItem: string): React.ReactElement => (
                        <li key={listItem}>{listItem}</li>
                      )
                    )}
                  </List>
                </DetailledText>
              );

            case "subsection":
              return (
                <DetailledText key={item.name}>
                  <h1 id={item.id}>{item.name}</h1>
                  {item.body.map(
                    (subItem: BodyContent): React.ReactElement => {
                      switch (subItem.type) {
                        case "text":
                          return (
                            <DetailledText
                              key={subItem.name}
                              className={containerStyle["sub-groups"]}
                            >
                              <h2 id={subItem.id}>{subItem.name}</h2>
                              <p>{subItem.text}</p>
                            </DetailledText>
                          );

                        case "textlist":
                          return (
                            <DetailledText
                              key={subItem.name}
                              className={containerStyle["sub-groups"]}
                            >
                              <h2 id={subItem.id}>{subItem.name}</h2>
                              {subItem.texts.map(
                                (text: string): React.ReactElement => (
                                  <p key={text}>{text}</p>
                                )
                              )}
                            </DetailledText>
                          );

                        case "list":
                          return (
                            <DetailledText
                              key={item.name}
                              className={containerStyle["sub-groups"]}
                            >
                              <h2 id={subItem.id}>{subItem.name}</h2>
                              <List
                                className={`${listStyles.list} ${containerStyle["list-margin"]}`}
                              >
                                {subItem.items.map(
                                  (listItem: string): React.ReactElement => (
                                    <li key={listItem}>{listItem}</li>
                                  )
                                )}
                              </List>
                            </DetailledText>
                          );

                        default:
                          return <></>;
                      }
                    }
                  )}
                </DetailledText>
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
