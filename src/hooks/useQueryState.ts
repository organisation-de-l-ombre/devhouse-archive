import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

type QueryStateHook<T> = [
  queryState: T | undefined,
  setQueryState: Dispatch<SetStateAction<T | undefined>>
];

const useQueryState = <T>(
  name: string,
  defaultValue?: T
): QueryStateHook<T> => {
  const queryRef = useRef<URLSearchParams>(
    new URLSearchParams(window.location.search)
  );
  const parse = (value: string | null) => {
    if (!value) {
      return defaultValue;
    }

    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  };
  const [queryState, setQueryState] = useState<T | undefined>(
    parse(queryRef.current.get(name))
  );

  useEffect((): void => {
    if (queryState === undefined) {
      return;
    }

    queryRef.current = new URLSearchParams(window.location.search);
    queryRef.current.set(name, JSON.stringify(queryState));
    window.history.replaceState(null, "", `?${queryRef.current.toString()}`);
  }, [name, queryState]);

  const { pathname } = useLocation();

  useEffect((): void => {
    if (queryState === undefined) {
      return;
    }

    queryRef.current = new URLSearchParams(window.location.search);
    queryRef.current.set(name, JSON.stringify(queryState));
    window.history.replaceState(null, "", `?${queryRef.current.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return [queryState, setQueryState];
};

export default useQueryState;
