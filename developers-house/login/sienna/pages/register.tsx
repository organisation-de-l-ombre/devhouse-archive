/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ReactElement, useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button, ButtonContainer } from "../components/button";
import styles from "../styles/pages/register.module.scss";
import { ErrorGate } from "../components/ErrorGate";

export default function Register(): ReactElement {
  const username = useRef<HTMLInputElement>(null);
  const privateAccount = useRef<HTMLInputElement>(null);
  const terms = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>(null);
  const router = useRouter();
  const { query } = router;

  const captchaError = useCallback(() => {
    setToken(null);
  }, []);

  const submit = useCallback(async (): Promise<void> => {
    try {
      if (!loading) return;
      const name = username.current.value;
      if (!token) {
        alert("You need to do the captcha.");
        return;
      }
      if (name.length < 3 || name.length > 32) {
        alert(
          "Your name must have at least 3 characters and least than 32 characters."
        );
        return;
      }
      if (!terms.current.checked) {
        alert("You must agree to the terms and conditions.");
        return;
      }
      setLoading(true);
      const response = await fetch("/dialog/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          private: privateAccount.current.checked,
          term: terms.current.checked,
          captcha: token,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        setLoading(false);
        await router.push(json.redirect);
      }
    } catch (e) {
      setLoading(false);
      setError(e);
    }
  }, [loading, token, router]);

  return (
    <ErrorGate loading={loading} error={error}>
      <Head key="register-page">
        <title>Sienna - Registration</title>
      </Head>
      <div className={styles.register}>
        <h2>Hello {query.username}!</h2>
        <p>
          Welcome to <b>Developer&rsquo;s House</b>! As a new member, you need
          to create an account and accept our <a href="#a">terms of service</a>{" "}
          in order to continue.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className={styles.form}
        >
          <div className={`${styles["form-element"]} ${styles.column}`}>
            <label htmlFor="register-username">Username</label>
            <input
              ref={username}
              type="text"
              id="register-username"
              defaultValue={query.username}
              minLength={3}
              maxLength={32}
            />
          </div>
          <div className={styles["form-element"]}>
            <input ref={privateAccount} type="checkbox" id="private-account" />
            <label htmlFor="private-account">Private account</label>
          </div>
          <div className={styles["form-element"]}>
            <input ref={terms} type="checkbox" id="accept-terms" />
            <label htmlFor="accept-terms">
              Accept our{" "}
              <a href="https://developershouse.xyz/terms" target="blank">
                terms of service
              </a>
            </label>
          </div>
          <HCaptcha
            onVerify={setToken}
            onError={captchaError}
            onExpire={captchaError}
            sitekey="e064279d-2004-485f-bbd8-6e5c5b2db934"
          />
          <ButtonContainer horizontal>
            <Button type="submit" onClick={submit}>
              Create account
            </Button>
          </ButtonContainer>
        </form>
      </div>
    </ErrorGate>
  );
}
