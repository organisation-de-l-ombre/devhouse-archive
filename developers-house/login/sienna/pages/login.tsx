import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React, { ReactElement } from "react";
import { AxiosResponse } from "axios";
import { LoginRequest } from "@ory/hydra-client";
import { withIronSession } from "next-iron-session";
import { randomBytes } from "crypto";
import { Admin } from "../lib/admin";
import { Button, ButtonContainer } from "../components/button";
import { ironSession } from "../lib/options";
import { Providers } from "../lib/providers";

export default function Login(props: LoginProps): ReactElement {
  const { client, loginChallenge, platforms, state } = props;

  return (
    <div>
      <h2>Login page</h2>
      <br />
      <p>
        Welcome to <b>Developer&rsquo;s House!</b> To continue, you need to
        login to your account or create one. Our system does not accepts
        password / email login for security reasons and we propose a variety of
        login providers available to you. You must login to continue to{" "}
        <u>{client.name}</u>
      </p>
      <ButtonContainer>
        {platforms.map((platform) => (
          <Button style={{ background: platform.color }} key={platform.name}>{platform.name}</Button>
        ))}
      </ButtonContainer>
    </div>
  );
}

interface LoginProps {
  platforms: { color: string; name: string }[];
  client: {
    name: string;
  };
  loginChallenge: string;
  state: string;
}

async function serverSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<LoginProps>> {
  const { query, req } = context;
  if (!query.login_challenge) return { notFound: true };
  const { data }: AxiosResponse<LoginRequest> = await Admin.getLoginRequest(
    query.login_challenge as string
  ).catch(() => ({ data: null } as AxiosResponse));
  if (!data) return { notFound: true };
  const state = randomBytes(32).toString("base64");
  req.session.set("loginSession", {
    challenge: query.login_challenge as string,
    state,
  });
  await req.session.save();
  return {
    props: {
      platforms: Array.from(Providers.values()).map((x) => x.meta()),
      client: {
        name: data.client.client_name,
      },
      loginChallenge: query.login_challenge as string,
      state,
    },
  };
}

export const getServerSideProps = withIronSession(
  serverSideProps,
  ironSession()
);
