import { Dispatch, SetStateAction } from "react";

export type QueryStateHook<T> = [
  queryState: T | undefined,
  setQueryState: Dispatch<SetStateAction<T | undefined>>
];
