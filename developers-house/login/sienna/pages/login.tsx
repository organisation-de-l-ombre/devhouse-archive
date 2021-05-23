import React, { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import Loader from "react-loaders";
import { Button, ButtonContainer } from "../components/button";
import { fetchLogin, LoginFetchResponse } from "../lib/api/login";
import styles from "../styles/pages/consent.module.scss";
import { usePageState } from "../lib/usePageState";

export default function Login(): ReactElement {
  const router = useRouter();

  const fetchingFunction = useCallback(async () => {
    const challenge = router.query.login_challenge as string;
    if (challenge) {
      return fetchLogin(challenge);
    }
    throw new Error("No challenge specified.");
  }, [router.query.login_challenge]);

  const { error, data, loading } = usePageState<LoginFetchResponse>(
    fetchingFunction
  );

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <h2>Login page</h2>
      <br />
      <p>
        Welcome to <b>Developer&rsquo;s House!</b> To continue, you need to
        login to your account or create one. Our system does not accepts
        password / email login for security reasons and we propose a variety of
        login providers available to you. You must login to continue to{" "}
        <u>{data.clientName}</u>
      </p>
      <ButtonContainer>
        {data.platforms.map((platform) => (
          <a href={platform.url}>
            <Button style={{ background: platform.color }} key={platform.name}>
              {platform.name}
            </Button>
          </a>
        ))}
      </ButtonContainer>
    </div>
  );
}
