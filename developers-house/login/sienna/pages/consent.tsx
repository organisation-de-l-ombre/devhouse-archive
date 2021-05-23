import React, { ReactElement, useCallback } from "react";
import Loader from "react-loaders";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button, ButtonContainer } from "../components/button";
import styles from "../styles/pages/consent.module.scss";
import globalStyles from "../styles/generic.module.scss";
import { ConsentFetchResponse, fetchConsent } from "../lib/consent";
import { usePageState } from "../lib/usePageState";

export default function Consent(): ReactElement {
  const router = useRouter();
  const fetchingFunction = useCallback(async () => {
    const challenge = router.query.consent_challenge as string;
    if (challenge) {
<<<<<<< HEAD
      return fetchConsent(challenge);
    }
    throw new Error("No challenge specified.");
  }, [router.query.consent_challenge]);
=======
      fetchConsent(challenge)
        .then((data) => {
          if (data.redirect) {
            router.push(data.redirect);
          } else {
            setConsent(data);
          }

          setLoading(false);
        })
        .catch((error: Error): void => {
          router.push(`/?error_message=${error.message}`);
        });
    }
  }, [router, router.query.consent_challenge]);
>>>>>>> 5788435a3b55b841915a3f3ac00164d91b14be9c

  const {
    error,
    data,
    loading,
    setLoading,
  } = usePageState<ConsentFetchResponse>(fetchingFunction);

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
          challenge: data.challenge,
          scopes: data.scopes,
          audiences: data.audiences,
        }),
      });
      if (response.ok) {
        const json = await response.json();
        await router.push(json.redirect);
      }
    },
    [data, setLoading, router]
  );

  if (error) {
    return <p>{error.message}</p>;
  }

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className={styles.consent}>
      <h2>Consent page</h2>
      <h3>{data.clientName}</h3>
      <p>
        This application needs some kind of access to your account and needs
        your consent, if you do not trust this application, feel free to reject
        the consent request. This application requires the following
        permissions:
      </p>

      <div className={styles.scopes}>
        {data.scopes.map((val) => (
          <code key={val}>{val}</code>
        ))}
=======
    <>
      <Head key="consent-page">
        <title>Sienna - Consent</title>
      </Head>
      <div className={styles.consent}>
        <h2>Consent page</h2>
        <h3>{consent.clientName}</h3>
        <p>
          This application needs some kind of access to your account and needs
          your consent, if you do not trust this application, feel free to
          reject the consent request. This application requires the following
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
>>>>>>> 5788435a3b55b841915a3f3ac00164d91b14be9c
      </div>
    </>
  );
}
