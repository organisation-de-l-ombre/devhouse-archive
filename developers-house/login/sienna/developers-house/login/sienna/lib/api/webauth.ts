export interface WebAuthnFetchResponse {
  challenge: string;
  credentials: string[];
}

export const askWebAuthLogin = async (
  options: WebAuthnFetchResponse
): Promise<Credential> => {
  if ("credentials" in navigator) {
    const challenge: BufferSource = Uint8Array.from(options.challenge, (c) =>
      c.charCodeAt(0)
    );
    const credentials = options.credentials.map(
      (id) =>
        ({
          id: Uint8Array.from(id, (c) => c.charCodeAt(0)),
          type: "public-key",
        } as PublicKeyCredentialDescriptor)
    );

    const response = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: credentials,
        timeout: 60000,
        userVerification: "discouraged",
      },
    });

    return response;
  }
  throw new Error("Webauthn is not supported.");
};
