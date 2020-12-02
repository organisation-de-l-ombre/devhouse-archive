import {GetServerSidePropsContext, GetServerSidePropsResult} from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { applySession } from "next-session";
import {AdminAPI, validateHydraResponse} from "../lib/service/hydra";
import {options} from "../lib/service/session";
import {provide} from "../lib/service/csrf";

type Props = {
  csrf: string;
  client: { name: string };
  consentChallenge: string;
  scopes: string[];
};

export default function Consent(props: Props): ReactElement {

  const {
    csrf,
      client,
      consentChallenge,
      scopes,
  } = props;

  return (
    <div>
      <h2>Consent page</h2>
      <p>
        The application {client.name} needs some kind of access to your account and
        needs your consent, if you do not trust this application, feel free to
        reject the consent request. This application requires the following
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

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  // Consent.
  const {
    query,
      req,
      res,
  } = context;

  let consentChallenge = query.consent_challenge;
  if (Array.isArray(consentChallenge)) {
    consentChallenge =  consentChallenge[0];
  }

  if (consentChallenge) {

    const {
      client: { client_name, client_id },
      requested_scope,
    } = await AdminAPI.getConsentRequest(consentChallenge).then(validateHydraResponse);

    // Load the session.
    await applySession(req, res, options);
    // Save the scopes in the session.
    context.req.session.consent = {
      scopes: requested_scope
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
