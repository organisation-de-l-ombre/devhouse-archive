import React, { ReactElement } from "react";
import { NextRouter, useRouter } from "next/router";
import Head from "next/head";
import styles from "../styles/pages/error.module.scss";

function Error(): ReactElement {
  const router: NextRouter = useRouter();
  const error =
    router.query.error_message || router.query.error_description || router.query.message;

  return (
    <>
      <Head key="error-page">
        <title>Sienna - Error</title>
      </Head>
      <div className={styles.error}>
        <h2>Something wrong happened</h2>
        <p>
          There might be a problem with our system. Check the page you were
          before and report the error to us. If you have any error below it can
          be helpful to resolve the issue you encountered.
        </p>
        <p>
          In any case, if the problem persists, you can report it to us on the{" "}
          <a href="https://developershouse.xyz/support" target="blank">
            Developer&#39;s House website
          </a>
          .
        </p>
        {error && <code className={styles["generic-margin-top"]}>{error}</code>}
      </div>
    </>
  );
}

export default Error;
