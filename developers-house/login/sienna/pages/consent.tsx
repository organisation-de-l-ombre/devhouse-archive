import React, { ReactElement, useCallback, useState } from "react";
import Loader from "react-loaders";
import { withIronSession } from "next-iron-session";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ConsentRequest } from "@ory/hydra-client";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { Button, ButtonContainer } from "../components/button";
import styles from "../styles/pages/consent.module.scss";
import globalStyles from "../styles/generic.module.scss";
import { ironSession } from "../lib/options";
import { Admin } from "../lib/admin";

export default function Consent({ consent }: ConsentProps): ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const submit = useCallback(
    async (granted: boolean) => {
      setLoading(true);
      const response = await fetch("/dialog/api/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          granted,
          challenge: consent.challenge,
          scopes: consent.scopes,
          audiences: consent.audiences,
        }),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.code === 200) {
          await router.push(json.redirect);
        }
      }
    },
    [consent.audiences, consent.challenge, consent.scopes, router]
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

interface ConsentProps {
  consent: {
    scopes: string[];
    clientName: string;
    audiences: string[];
    challenge: string;
  };
}

async function serverSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ConsentProps>> {
  const { query, req } = context;
  if (!query.consent_challenge) return { notFound: true };
  const { data }: AxiosResponse<ConsentRequest> = await Admin.getConsentRequest(
    query.consent_challenge as string
  ).catch(() => ({ data: null } as AxiosResponse));
  if (!data) return { notFound: true };
  req.session.set("consentSession", {
    audiences: data.requested_access_token_audience,
    challenge: query.consent_challenge as string,
    clientName: data.client.client_name,
    scopes: data.requested_scope,
  });
  await req.session.save();
  return {
    props: {
      consent: {
        audiences: data.requested_access_token_audience,
        challenge: query.consent_challenge as string,
        clientName: data.client.client_name,
        scopes: data.requested_scope,
      },
    },
  };
}

export const getServerSideProps = withIronSession(
  serverSideProps,
  ironSession()
);
