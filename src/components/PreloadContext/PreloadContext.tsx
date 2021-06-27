import { createContext, useContext } from "react";
import { QueryClient, useQueryClient } from "react-query";

type Preload = {
  promise: Promise<unknown>[];
  cache?: string;
};
export type PreloadContextType = {
  done: boolean;
  promises: Preload[];
} | null;

const PreloadContext = createContext<PreloadContextType>(null);

export default PreloadContext;

export function usePreload(
  callback: (queryCache: QueryClient) => Preload
): void {
  const preloadContext = useContext(PreloadContext);
  const queryCache = useQueryClient();
  if (!preloadContext) return;
  if (preloadContext.done) return;

  preloadContext.promises.push(callback(queryCache));
}
