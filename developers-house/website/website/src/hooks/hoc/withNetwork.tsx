import React, { useCallback, useEffect, useState } from "react";
import CenteredMessage from "../../components/CenteredMessage/CenteredMessage";

export function withNetwork<P>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return ((props) => {
    const [network, setNetwork] = useState(window.navigator.onLine);

    const setOffline = useCallback(() => {
      setNetwork(false);
    }, []);
    const setOnline = useCallback(() => {
      setNetwork(true);
    }, []);

    useEffect(() => {
      window.addEventListener("offline", setOffline);
      window.addEventListener("online", setOnline);

      return () => {
        window.removeEventListener("offline", setOffline);
        window.removeEventListener("online", setOnline);
      };
    }, [setOffline, setOnline]);

    if (network) {
      return <WrappedComponent {...props} />;
    }

    return (
      <CenteredMessage title="You are offline!">
        You need an internet connection to access to this page.
      </CenteredMessage>
    );
  }) as React.FC<P>;
}
