import React from "react";
import { FlexContainer } from "@components/ui";
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rehypeHighlight from "rehype-highlight";
import { Markdown, fetchWiki } from "@lib/fetchWiki";
import { useLanguage } from "@hooks/Language";
import { NotFound, Suspense } from "@components/modules";
import styles from "../../InternalRoot.module.scss";

const Intro = (): React.ReactElement => {
  const { language } = useLanguage();
  const [isFetching, setIsFetching] = React.useState(true);
  const [markdown, setMarkdown] = React.useState<Markdown | null>(null);

  React.useEffect((): void => {
    fetchWiki({
      type: "internal",
      language,
      path: "sections_intro",
    }).then((response: Markdown | null): void => {
      if (response !== null) {
        setMarkdown(response);
      }

      setIsFetching(false);
    });
  });

  if (isFetching) {
    return <Suspense />;
  }

  return (
    <FlexContainer className={styles.content}>
      {markdown ? (
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {markdown.body}
        </ReactMarkdown>
      ) : (
        <NotFound />
      )}
    </FlexContainer>
  );
};

export default Intro;
