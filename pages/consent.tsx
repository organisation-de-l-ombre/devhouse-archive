import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "react-loaders";
import { Button, ButtonContainer } from "../components/button";
import {
  getConsent,
  GetConsentReturn,
  validateConsent,
} from "../lib/rpc/fetchConsent";
import styles from "../styles/pages/consent.module.scss";
import globalStyles from "../styles/generic.module.scss";

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
