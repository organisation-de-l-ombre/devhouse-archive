export type OrError<T> =
  | ({ error: false } & T)
  | { error: true; message: string };
