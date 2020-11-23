import { GetServerSidePropsContext } from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { AdminAPI, validateHydraResponse } from "../service/hydra";

import { provide } from "../service/csrf";
import { applySession } from "next-session";
import { options } from '../service/session';

export default function Consent({
  client: { challenge, name },
  csrf,
  requested_scope,
}: {
  csrf: string;
  client: { challenge: string; name: string };
  requested_scope: string[];
}): ReactElement {
  return (
    <div>
      <h2>Consent page</h2>
      <p>
        The application {name} needs some kind of access to your account and
        needs your consent, if you do not trust this application, feel free to
        reject the consent request. This application requires the following
        permissions.
      </p>

      <ul>
        {requested_scope.map((val) => (
          <li key={val}>{val}</li>
        ))}
      </ul>
      <form method="POST" action="/dialog/api/consent/validate">
        <ButtonContainer horizontal>
          <Button name="validate" value="accept">
            Accept
          </Button>
          <Button name="validate" value="reject">
            Reject
          </Button>
          <input type="hidden" value={challenge} name="challenge" />
          <input type="hidden" value={csrf} name="_csrf" />
        </ButtonContainer>
      </form>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Fetch the request.
  if (context.query.consent_challenge) {
    const {
      client: { client_name, client_id },
      subject,
      requested_scope,
    } = await AdminAPI.getConsentRequest(
      context.query.consent_challenge as string
    ).then(validateHydraResponse);
    // Load the session.
    await applySession(context.req as any, context.res, options);
    (context.req as any).session.scopes = requested_scope;
    return {
      props: {
        client: {
          name: client_name || client_id,
          challenge: context.query.consent_challenge,
        },
        subject,
        requested_scope,
        csrf: await provide(context.req as any),
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}
