import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React, { ReactElement, useCallback, useState } from "react";
import { AxiosResponse } from "axios";
import { LogoutRequest } from "@ory/hydra-client";
import { withIronSession } from "next-iron-session";
import { useRouter } from "next/router";
import { Admin } from "../lib/admin";
import { Button, ButtonContainer } from "../components/button";
import { ironSession } from "../lib/options";

type LogoutProps = {
  logoutChallenge: string;
};

export default function Logout(props: LogoutProps): ReactElement {
  const { logoutChallenge } = props;
  const router = useRouter();
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    const response = await fetch("/dialog/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        challenge: logoutChallenge,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      if (json.code === 200) {
        await router.push(json.redirect);
      }
    }
  }, [logoutChallenge, router]);

  if (done) {
    window.close();
    return <p>You can close this window.</p>;
  }

  return (
    <div>
      <h2>Logout</h2>
      <br />
      <p>
        Are you sure you want to logout ?
        <i>
          This will <u>not</u> revoke the authorizations.
        </i>
      </p>
      <ButtonContainer horizontal>
        <Button onClick={submit}>Accept</Button>
        <Button onClick={() => setDone(true)}>Reject</Button>
      </ButtonContainer>
    </div>
  );
}

async function serverSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<LogoutProps>> {
  const { query, req } = context;
  if (!query.logout_challenge) return { notFound: true };
  const { data }: AxiosResponse<LogoutRequest> = await Admin.getLogoutRequest(
    query.logout_challenge as string
  ).catch(() => ({ data: null } as AxiosResponse));
  if (!data) return { notFound: true };
  req.session.set("logoutSession", {
    challenge: query.logout_challenge as string,
  });
  await req.session.save();
  return {
    props: {
      logoutChallenge: query.logout_challenge as string,
    },
  };
}

export const getServerSideProps = withIronSession(
  serverSideProps,
  ironSession()
);
