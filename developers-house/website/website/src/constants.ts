import { DisplayDataApi } from "@developers-house/abdera";

const DisplayAPIClient = new DisplayDataApi();

const params: {
  [key: string]: string;
} = {};

const doSearch = (hash: string) => {
  hash.split("&").forEach((hk) => {
    const temp = hk.split("=");
    const [name, value] = temp;
    params[name] = value;
  });
};

doSearch(window.location.hash.substring(1) || "");
doSearch(window.location.href.split("?")[1] || "");

const RequestParams = params;

export { RequestParams, DisplayAPIClient };
