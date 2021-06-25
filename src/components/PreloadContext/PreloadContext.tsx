import { createContext, useContext } from "react";
import { QueryClient, useQueryClient } from "react-query";

const PreloadContext = createContext<{
  done: boolean;
  promises: Promise<unknown>[];
} | null>(null);

export default PreloadContext;

export function usePreload<T>(
  callback: (queryCache: QueryClient) => Promise<T>
): void {
  const preloadContext = useContext(PreloadContext);
  const queryCache = useQueryClient();
  if (!preloadContext) return;
  if (preloadContext.done) return;

  preloadContext.promises.push(callback(queryCache));
}
