import { ServerContextProps } from "@contexts/server";
import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";

// Detects is client device is mobile of desktop
const detectMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") {
    return false;
  }

  return !!(
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  );
};

// Fetches images with Developer's House image proxy
interface FetchImageProps {
  image: string;
  width: number;
  height: number;
  format?: "jpg" | "jpeg" | "png" | "webp" | "gif";
}

const fetchImage = ({
  image,
  width,
  height,
  format,
}: FetchImageProps): string => {
  return `https://imageproxy.developershouse.xyz/${`${image}${
    format ? `.${format}` : ""
  }`}?width=${width}&height=${height}`;
};

// Gets IMR instance client id
const getClientId = (): string => {
  if (process.env.NODE_ENV === "development") {
    return "5850f912-4654-42c4-9961-6ce577288bdb";
  }

  return process.env.client_id || "";
};

// Displays or not navbar in function of different routes
const navbarRoutesBlacklist: string[] = ["/callback", "/auth/login"];

// Calculates durations
const calculateDuration = (timestamp: number): string => {
  const temp: string[] = [];
  const duration: Duration = dayjs.duration(timestamp);
  const displayUnits: string[] = ["h", "m"];
  const unitsResults: number[] = [duration.hours(), duration.minutes()];

  for (let i = 0; i < displayUnits.length; i += 1) {
    if (unitsResults[i] > 0) {
      temp.push(`${unitsResults[i]}${displayUnits[i]}`);
    }
  }

  return temp.join(" ");
};

// Formats an URL with a custom path
const formatURL = (
  serverContext: ServerContextProps,
  customPath?: string
): string => {
  if (serverContext) {
    const { request } = serverContext;

    return `${request.protocol}://${request.get("host")}${
      customPath || request.path
    }`;
  }

  return `${window.location.origin}${customPath || window.location.pathname}`;
};

export {
  detectMobileDevice,
  fetchImage,
  getClientId,
  navbarRoutesBlacklist,
  calculateDuration,
  formatURL,
};
