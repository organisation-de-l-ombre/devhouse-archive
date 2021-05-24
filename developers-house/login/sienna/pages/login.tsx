import React, { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ButtonContainer, ButtonLink } from "../components/button";
import { fetchLogin, LoginFetchResponse } from "../lib/api/login";
import { usePageState } from "../lib/usePageState";
import { ErrorGate } from "../components/ErrorGate";

export default function Login(): ReactElement {
  const router = useRouter();

  const fetchingFunction = useCallback(async () => {
    const challenge = router.query.login_challenge as string;
    if (challenge) {
      const fetch = await fetchLogin(challenge);
      if (fetch.error) {
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

  const { error, data, loading } = usePageState<LoginFetchResponse>(
    fetchingFunction
  );

  return (
    <ErrorGate error={error} loading={loading || !data}>
      {data && (
        <>
          <Head key="login-page">
            <title>Sienna - Login</title>
          </Head>
          <h2>Login page</h2>
          <br />
          <p>
            Welcome to <b>Developer&rsquo;s House!</b> To continue, you need to
            login to your account or create one. Our system does not accepts
            password / email login for security reasons and we propose a variety
            of login providers available to you. You must login to continue to{" "}
            <u>{data.clientName}</u>
          </p>
          <ButtonContainer>
            {data.platforms.map((platform) => (
              <ButtonLink
                href={platform.url}
                style={{ background: platform.color }}
                key={platform.name}
              >
                {platform.name}
              </ButtonLink>
            ))}
          </ButtonContainer>
        </>
      )}
    </ErrorGate>
  );
}
