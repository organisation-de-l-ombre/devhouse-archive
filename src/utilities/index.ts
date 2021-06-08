export * from "./functions";
export * from "./serviceWorker";

export function urlEncodeFormData(fd: { [key: string]: string }): string {
  let s = "";
  Object.keys(fd).forEach((pair) => {
    s += `${(s ? "&" : "") + encodeURIComponent(pair)}=${fd[pair]}`;
  });
  return s;
}
