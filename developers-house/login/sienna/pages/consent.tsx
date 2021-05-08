import React, { ReactElement, useCallback, useEffect, useState } from "react";
import Loader from "react-loaders";
import { useRouter } from "next/router";
import { Button, ButtonContainer } from "../components/button";
import styles from "../styles/pages/consent.module.scss";
import globalStyles from "../styles/generic.module.scss";
import { ConsentFetchResponse, fetchConsent } from "../lib/consent";

export default function Consent(): ReactElement {
  const [loading, setLoading] = useState<boolean>(true);
  const [consent, setConsent] = useState<ConsentFetchResponse>(null);
  const router = useRouter();

  useEffect(() => {
    const challenge = router.query.consent_challenge as string;
    if (challenge) {
      fetchConsent(challenge)
        .then(setConsent)
        .then(() => setLoading(false));
    }
  }, [router.query.consent_challenge]);

  const submit = useCallback(
    async (granted: boolean) => {
      setLoading(true);
      const response = await fetch("/dialog/api/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          granted,
          challenge: consent.challenge,
          scopes: consent.scopes,
          audiences: consent.audiences,
        }),
      });
      if (response.ok) {
        const json = await response.json();
        await router.push(json.redirect);
      }
    },
    [consent, router]
  );

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  return (
    <div className={styles.consent}>
      <h2>Consent page</h2>
      <h3>{consent.clientName}</h3>
      <p>
        This application needs some kind of access to your account and needs
        your consent, if you do not trust this application, feel free to reject
        the consent request. This application requires the following
        permissions:
      </p>

      <div className={styles.scopes}>
        {consent.scopes.map((val) => (
          <code key={val}>{val}</code>
        ))}
      </div>
      <ButtonContainer
        horizontal
        className={globalStyles["alignment-full-center"]}
      >
        <Button onClick={() => submit(true)}>Accept</Button>
        <Button onClick={() => submit(false)}>Reject</Button>
      </ButtonContainer>
    </div>
  );
}
