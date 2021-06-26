import times from "lodash.times";

export function randomString(randomBytesLength = 48): string {
  if (typeof window === "undefined") {
    return "";
  }
  // 9 * 4/3 = 12
  // this is to avoid getting padding of a random byte string when it is base64 encoded
  let randomBytes: Uint8Array | number[];

  if (window.crypto && window.crypto.getRandomValues) {
    randomBytes = new Uint8Array(randomBytesLength);
    window.crypto.getRandomValues(randomBytes);
  } else {
    randomBytes = times(randomBytesLength, () =>
      Math.floor(Math.random() * 256)
    );
  }

  return window
    .btoa(String.fromCharCode(...randomBytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}
