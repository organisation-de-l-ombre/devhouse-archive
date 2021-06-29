import React from "react";
import { FlexContainer } from "@components/ui";
import ReactMarkdown from "react-markdown";
import useLanguage from "@hooks/useLanguage";
import { NotFound, SuspenseComponent } from "@components/modules";
import { WikiAPI } from "@lib/api";
import { useQuery } from "react-query";
import fetchOptions from "@lib/api/fetchOptions";
import { FunctionComponent } from "@typings/FunctionComponent";
import styles from "./WikiSection.module.scss";

const WikiSection: FunctionComponent<
  HTMLDivElement,
  { type: string; section: string }
> = ({ type, section }) => {
  const { language } = useLanguage();
  const { isFetching, data } = useQuery(
    `wiki/internal/${section}`,
    () => {
      return WikiAPI.getWiki({
        type,
        language,
        path: `sections_${section}`,
      });
    },
    fetchOptions
  );

  if (isFetching) {
    return <SuspenseComponent />;
  }

  if (!data || (data && !data.body)) {
    return <NotFound />;
  }

  return (
    <FlexContainer
      padding
      pageBodyWidth
      expand
      column
      className={styles.markdown}
    >
      <ReactMarkdown>{data.body}</ReactMarkdown>
    </FlexContainer>
  );
};

export default WikiSection;
