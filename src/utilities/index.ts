export * from "./functions";
export * from "./account";
export * from "./serviceWorker";

export function urlEncodeFormData(fd: string[][]): string {
  let s = "";
  fd.forEach((pair) => {
    if (typeof pair[1] === "string") {
      s += `${(s ? "&" : "") + encodeURIComponent(pair[0])}=${pair[1]}`;
    }
  });
  return s;
}
