import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { applySession } from "next-session";
import { options } from "../lib/service/session";
import { provide } from "../lib/service/csrf";

type Props = {
  csrf: string;
  logoutChallenge: string;
};

export default function Logout(props: Props): ReactElement {
  const { csrf, logoutChallenge } = props;

  return (
    <div>
      <h2>Logout</h2>
      <p>Are you sure you want to logout ?</p>

      <form method="POST" action={"/dialog/api/logout/validate"}>
        <ButtonContainer horizontal>
          <Button name="validate" value="accept">
            Yes
          </Button>
          <Button name="validate" value="reject">
            No
          </Button>
          <input type="hidden" value={logoutChallenge} name="challenge" />
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

  let logoutChallenge = query.logout_challenge;
  if (Array.isArray(logoutChallenge)) {
    logoutChallenge = logoutChallenge[0];
  }

  if (logoutChallenge) {
    // Load the session.
    await applySession(req as any, res, options);
    // Save the scopes in the session.
    req.session.logout = {
      logoutChallenge,
    };
    // Return the scopes for the request.
    return {
      props: {
        csrf: await provide(req),
        logoutChallenge,
      },
    };
  }
  return {
    notFound: true,
  };
}
