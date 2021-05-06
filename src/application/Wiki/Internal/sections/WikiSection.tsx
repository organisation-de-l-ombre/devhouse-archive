import React from "react";
import { FlexContainer } from "@components/ui";
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rehypeHighlight from "rehype-highlight";
import { useLanguage } from "@hooks/Language";
import { NotFound, Suspense } from "@components/modules";
import { WikiAPI } from "@lib/api";
import { useQuery } from "react-query";
import styles from "../InternalRoot.module.scss";

const WikiSection: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { type: string; section: string }
> = ({ type, section }) => {
  const { language } = useLanguage();
  const { isFetching, data } = useQuery(
    `wiki-internal-${section}`,
    () => {
      return WikiAPI.getWiki({
        type,
        language,
        path: `sections_${section}`,
      });
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  if (isFetching) {
    return <Suspense />;
  }

  if (!data || (data && !data.body)) {
    return <NotFound />;
  }

  return (
    <FlexContainer className={styles.content}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {data.body}
      </ReactMarkdown>
    </FlexContainer>
  );
};

export default WikiSection;
