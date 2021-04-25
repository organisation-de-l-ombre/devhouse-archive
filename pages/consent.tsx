import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "react-loaders";
import { Button, ButtonContainer } from "../components/button";
import {
  getConsent,
  GetConsentReturn,
  validateConsent,
} from "../lib/rpc/fetchConsent";

export default function Consent(): ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [consent, setConsent] = useState<GetConsentReturn>();

  const route = useRouter();

  useEffect(() => {
    (async function asyncUseEffect() {
      if (route.query.consent_challenge) {
        const data = await getConsent({
          challenge: route.query.consent_challenge as string,
        });
        if (data) {
          setConsent(data);
          setLoading(false);
        } else {
          await route.push("/dialog/error", {
            pathname: "error",
            query: { message: "Invalid challenge" },
          });
        }
      }
    })();
  }, [route]);

  const submit = useCallback(
    async (granted: boolean) => {
      setLoading(true);
      const response = await validateConsent({
        granted,
        challenge: consent.challenge,
        scopes: consent.scopes,
        audiences: consent.audiences,
        token: consent.token,
      });
      if (response) {
        window.location.href = response.redirect;
      }
    },
    [consent]
  );

  if (loading) {
    return <Loader type="line-scale" active />;
  }

  return (
    <div>
      <h2>Consent page</h2>
      <p>
        The application {consent.clientName} needs some kind of access to your
        account and needs your consent, if you do not trust this application,
        feel free to reject the consent request. This application requires the
        following permissions.
      </p>

      <ul>
        {consent.scopes.map((val) => (
          <li key={val}>{val}</li>
        ))}
      </ul>
      <ButtonContainer horizontal>
        <Button onClick={() => submit(true)}>Accept</Button>
        <Button onClick={() => submit(false)}>Reject</Button>
      </ButtonContainer>
    </div>
  );
}
