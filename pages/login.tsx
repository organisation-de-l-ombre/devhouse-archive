import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React, { ReactElement } from "react";
import { Button, ButtonContainer } from "../components/button";
import { AdminAPI, validateHydraResponse } from "../lib/service/hydra";
import { Providers } from "../lib/service/providers";

type Props = {
  platforms: string[];
  client: {
    name: string;
  };
  loginChallenge: string;
  htmlClass: string;
};

export default function Login(props: Props): ReactElement {
  const { client, loginChallenge, platforms } = props;

  return (
    <div>
      <h2>Login page</h2>
      <p>
        Welcome to <b>Developer's House!</b> To continue, you need to login to
        your account or create one. Our system does not accepts password / email
        login for security reasons and we propose a variety of login providers
        available to you. You must login to continue to <b>{client.name}</b>
      </p>
      <ButtonContainer>
        {platforms.map((name) => {
          return (
            <a
              key={name}
              href={`/dialog/api/auth/initialize/${loginChallenge}/${name.toLowerCase()}`}
            >
              <Button>{name}</Button>
            </a>
          );
        })}
      </ButtonContainer>
    </div>
  );
}

/*
 * The props rendered in the server.
 */
export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  // Unpack
  const { query } = context;

  let loginChallenge: string | string[] = query.login_challenge;
  if (Array.isArray(loginChallenge)) {
    loginChallenge = loginChallenge[0];
  }
  // Get the requested login request & the information related to it.
  if (loginChallenge) {
    const {
      client: { client_name, client_id },
      request_url,
      skip,
      subject,
    } = await AdminAPI.getLoginRequest(
      context.query.login_challenge as string
    ).then(validateHydraResponse);

    if (skip) {
      const data = await AdminAPI.acceptLoginRequest(loginChallenge, {
        subject,
      }).then(validateHydraResponse);

      return {
        redirect: {
          destination: data.redirect_to,
          permanent: false,
        },
      };
    }

    const colorScheme = new URL(request_url).searchParams.get("cs");

    return {
      props: {
        client: {
          name: client_name || client_id,
        },
        htmlClass: colorScheme === "dark" ? "dark" : "light",
        platforms: Array.from(Providers.keys()),
        loginChallenge,
      },
    };
  }
  return {
    notFound: true,
  };
}
