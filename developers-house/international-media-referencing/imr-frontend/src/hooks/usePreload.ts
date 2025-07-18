import { ServerContext, ServerContextProps } from "@contexts/server";
import { useContext } from "react";
import { DefaultRootState, useSelector } from "react-redux";

const usePreload = <T>(
  callback: (getState: DefaultRootState) => Promise<T> | T
): void => {
  const serverContext: ServerContextProps = useContext(ServerContext);
  const state = useSelector((s) => s);
  if (typeof window !== "undefined" || serverContext?.preloadLoaded) {
    return;
  }

  serverContext?.preload.push(callback(state));
};

export default usePreload;
