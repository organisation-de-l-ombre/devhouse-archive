import React, { ReactElement, useCallback, useEffect } from "react";
import { Button } from "../components/button";

let aaaa;
const askWebAuthn = (chan: string): Promise<unknown> => {
  const challenge = Uint8Array.from(chan, (c) => c.charCodeAt(0));
  console.log(aaaa);
  return navigator.credentials
    .get({
      publicKey: {
        challenge,
        userVerification: "required",
        rpId: "localhost",
        allowCredentials: [aaaa],
      },
    })
    .then((credential) => {
      console.log(credential);
    });
};

function arrayBufferToString(buffer, encoding, callback) {
  const blob = new Blob([buffer], { type: "text/plain" });
  const reader = new FileReader();
  reader.onload = function (evt) {
    callback(evt.target.result);
  };
  reader.readAsText(blob, encoding);
}

const create = (chan: string) => {
  return navigator.credentials
    .create({
      publicKey: {
        challenge: Uint8Array.from(chan, (c) => c.charCodeAt(0)),
        rp: {
          name: "Developer's House",
          id: "localhost",
        },
        user: {
          id: Uint8Array.from("UZSL85T9AFC", (c) => c.charCodeAt(0)),
          name: "lee@webauthn.guide",
          displayName: "Lee",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "cross-platform",
          userVerification: "discouraged",
        },
        timeout: 60000,
        attestation: "indirect",
      },
    })
    .then((credential) => {
      aaaa = {
        id: credential.rawId,
        type: "public-key",
      };
    });
};

export default function WebAuthn(): ReactElement {
  const a = useCallback(() => {
    askWebAuthn("ldsjfskldjfkdsjfldskjflsdkjflsdkjflsdkjflsdkjflsdk");
  }, []);
  const b = useCallback(() => {
    create("ldsjfskldjfkdsjfldskjflsdkjflsdkjflsdkjflsdkjflsdk");
  }, []);
  return (
    <div>
      <h2>Web Auth</h2>
      <p>Login using your private key.</p>
      <Button onClick={a}>Ask</Button>
      <Button onClick={b}>Create</Button>
    </div>
  );
}
