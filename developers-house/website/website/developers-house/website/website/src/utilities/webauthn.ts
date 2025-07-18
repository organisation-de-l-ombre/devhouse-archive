import { SelfUser } from "@developers-house/abdera";

export const available =
  typeof navigator === "undefined" ? false : "credentials" in navigator;

export const requestKeyAdd = (
  challenge: string,
  user: SelfUser
): Promise<PublicKeyCredential | null> => {
  if (typeof navigator === "undefined") return Promise.resolve(null);
  return navigator.credentials.create({
    publicKey: {
      challenge: Uint8Array.from(challenge, (c) => c.charCodeAt(0)),
      rp: {
        name: "Developer's House",
        id: document.location.hostname,
      },
      user: {
        id: Uint8Array.from(user.id, (c) => c.charCodeAt(0)),
        name: user.username as string,
        displayName: user.username as string,
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      timeout: 60000,
    },
  }) as Promise<PublicKeyCredential | null>;
};

export function arrayBufferToBase64(buffer: ArrayBufferLike): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64: string): ArrayBufferLike {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
