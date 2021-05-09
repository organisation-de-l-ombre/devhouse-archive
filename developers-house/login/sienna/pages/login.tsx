import React, { ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "react-loaders";
import Head from "next/head";
import { ButtonContainer, ButtonLink } from "../components/button";
import { fetchLogin, LoginFetchResponse } from "../lib/login";
import styles from "../styles/pages/login.module.scss";

export default function Login(): ReactElement {
  const [loginSession, setSession] = useState<LoginFetchResponse>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const challenge = router.query.login_challenge as string;
    if (challenge) {
      fetchLogin(challenge)
        .then((data) => {
          if (data.redirect) {
            router.push(data.redirect);
          } else {
            setSession(data);
          }
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [router]);

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  return (
    <>
      <Head key="login-page">
        <title>Sienna - Login</title>
      </Head>
      <div className={styles.login}>
        <h2>Login page</h2>
        <p>
          Welcome to <b>Developer&rsquo;s House!</b> To continue, you need to
          login to your account or create one. Our system does not accepts
          password / email login for security reasons and we propose a variety
          of login providers available to you. You must login to continue to{" "}
          <u>{loginSession.clientName}</u>
        </p>
        <ButtonContainer>
          {loginSession.platforms.map((platform) => (
            <ButtonLink
              href={platform.url}
              style={{ backgroundColor: platform.color }}
              key={platform.name}
            >
              {platform.name}
            </ButtonLink>
          ))}
        </ButtonContainer>
      </div>
    </>
  );
}
