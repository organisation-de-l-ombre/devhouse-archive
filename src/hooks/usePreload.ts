import { ServerContext, ServerContextProps } from "@contexts/server";
import { useContext } from "react";

const usePreload = <T>(callback: () => Promise<T>): void => {
  const serverContext: ServerContextProps = useContext(ServerContext);

  if (typeof window !== "undefined" || serverContext?.preloadLoaded) {
    return;
  }

  serverContext?.preload.push(callback());
};

export default usePreload;
