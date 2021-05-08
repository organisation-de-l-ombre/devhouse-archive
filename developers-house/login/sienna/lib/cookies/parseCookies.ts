import cookie from "cookie";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const parseCookies = (req): unknown => {
  return cookie.parse((req ? req.headers.cookie : "") || "");
};

export default parseCookies;
