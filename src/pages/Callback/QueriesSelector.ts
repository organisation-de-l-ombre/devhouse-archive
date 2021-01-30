const requestParameters: {
  [key: string]: string;
} = {};
const search = (hash: string) => {
  hash.split("&").forEach((hk) => {
    const temp = hk.split("=");
    const [name, value] = temp;

    requestParameters[name] = value;
  });
};

search(window.location.hash.substring(1) || "");
search(window.location.search.substring(1) || "");

console.log(requestParameters);

export default requestParameters;
