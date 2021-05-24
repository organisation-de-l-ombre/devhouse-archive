import React, { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import { Button, ButtonContainer } from "../components/button";
import styles from "../styles/pages/consent.module.scss";
import globalStyles from "../styles/generic.module.scss";
import {
  ConsentFetchResponse,
  fetchConsent,
  validateConsent,
} from "../lib/api/consent";
import { usePageState } from "../lib/usePageState";
import { ErrorGate } from "../components/ErrorGate";

export default function Consent(): ReactElement {
  const router = useRouter();

  const fetchingFunction = useCallback(async () => {
    const challenge = router.query.consent_challenge as string;
    if (challenge) {
      const fetch = await fetchConsent(challenge);
      if (fetch.error === true) {
        throw new Error(fetch.message);
      }
      if (fetch.error === false) {
        if (fetch.redirect) {
          await router.push(fetch.redirect);
          return null;
        }
        return fetch;
      }
    }
    return null;
  }, [router]);


  const {
    error,
    data,
    loading,
    setLoading,
    setError,
  } = usePageState<ConsentFetchResponse>(fetchingFunction);

  const submit = useCallback(
    async (granted: boolean) => {
      setLoading(true);
      await validateConsent(granted).then(async (e) => {
        if (e.error === false) {
          await router.push(e.redirect);
        } else {
          setError(new Error(e.message));
        }
      });
      setLoading(false);
    },
    [setLoading, router, setError]
  );

  return (
    <ErrorGate loading={loading} error={error}>
      {data && (
        <div className={styles.consent}>
          <h2>Consent page</h2>
          <h3>{data.clientName}</h3>
          <p>
            This application needs some kind of access to your account and needs
            your consent, if you do not trust this application, feel free to
            reject the consent request. This application requires the following
            permissions:
          </p>

          <div className={styles.scopes}>
            {data.scopes.map((val) => (
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
      )}
    </ErrorGate>
  );
}
