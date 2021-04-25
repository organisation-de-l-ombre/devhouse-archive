interface FetchWikiOptions {
  type: string;
  language: string;
  path: string;
}
interface Markdown {
  statusCode: number;
  body: string;
}

const fetchWiki = async ({
  language,
  type,
  path,
}: FetchWikiOptions): Promise<Markdown | null> => {
  try {
    const markdownBase = await fetch(
      `https://amelia-api.developershouse.xyz/data/wiki/${type}/${language}/${path}`
    );

    if (markdownBase.status === 404) {
      return null;
    }

    return JSON.parse(await markdownBase.text());
  } catch {
    return null;
  }
};

export { Markdown, fetchWiki };
