import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { applySession } from "next-session";
import { AdminAPI, validateHydraResponse } from "../lib/service/hydra";
import { options } from "../lib/service/session";
import { provide } from "../lib/service/csrf";

type Props = {
  csrf: string;
  client: { name: string };
  consentChallenge: string;
  scopes: string[];
};

export default function Consent(props: Props): ReactElement {
  const { csrf, client, consentChallenge, scopes } = props;

  return (
    <div>
      <h2>Consent page</h2>
      <p>
        The application {client.name} needs some kind of access to your account
        and needs your consent, if you do not trust this application, feel free
        to reject the consent request. This application requires the following
        permissions.
      </p>

      <ul>
        {scopes.map((val) => (
          <li key={val}>{val}</li>
        ))}
      </ul>
      <form method="POST" action={"/dialog/api/consent/validate"}>
        <ButtonContainer horizontal>
          <Button name="validate" value="accept">
            Accept
          </Button>
          <Button name="validate" value="reject">
            Reject
          </Button>
          <input type="hidden" value={consentChallenge} name="challenge" />
          <input type="hidden" value={csrf} name="_csrf" />
        </ButtonContainer>
      </form>
    </div>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  // Consent.
  const { query, req, res } = context;

  let consentChallenge = query.consent_challenge;
  if (Array.isArray(consentChallenge)) {
    consentChallenge = consentChallenge[0];
  }

  if (consentChallenge) {
    const {
      client: { client_name, client_id },
      subject,
      requested_scope,
      requested_access_token_audience,
      skip,
    } = await AdminAPI.getConsentRequest(consentChallenge).then(
      validateHydraResponse
    );

    const user = await fetch(
      `${process.env.SCARLET_ENDPOINT}/api/users/${subject}`
    ).then((x) => x.json());
    if (skip) {
      const data = await AdminAPI.acceptConsentRequest(consentChallenge, {
        grant_scope: requested_scope,
        grant_access_token_audience: requested_access_token_audience,
        session: {
          id_token: {
            ...user,
            ban: undefined,
            uuid: undefined,
          },
        },
      }).then(validateHydraResponse);

      return {
        redirect: {
          permanent: false,
          destination: data.redirect_to,
        },
      };
    }

    // Load the session.
    await applySession(req as any, res, options);
    // Save the scopes in the session.
    req.session.consent = {
      user: user,
      scopes: requested_scope,
      audiences: requested_access_token_audience,
      consentChallenge,
    };
    // Return the scopes for the request.
    return {
      props: {
        client: {
          name: client_name || client_id,
        },
        csrf: await provide(req),
        consentChallenge: consentChallenge,
        scopes: requested_scope,
      },
    };
  }
  return {
    notFound: true,
  };
}
