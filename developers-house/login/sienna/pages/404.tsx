import React, { ReactElement } from "react";
import Head from "next/head";
import styles from "../styles/pages/error.module.scss";

function NotFound(): ReactElement {
  return (
    <>
      <Head key="not-found-page">
        <title>Sienna</title>
      </Head>
      <div className={styles.error}>
        <h2>404 not found</h2>
        <p>
          The page you are trying to access does not exist. You must have gotten
          lost...
        </p>
      </div>
    </>
  );
}

export default NotFound;
