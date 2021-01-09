/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { FallbackProps } from "react-error-boundary";
import styles from "./error-page.module.scss";

const ErrorPage = (props: unknown & FallbackProps): ReactElement => {
  const { resetErrorBoundary } = props;
  return (
    <div id="error-container" className={styles.errorPage}>
      <div id="error-window">
        <h1>Oops... The page just crashed...</h1>
        <p>
          Try refreshing the page. <br />
          If the problem persists, update your browser to the latest version.
          The error has been reported to our team.
        </p>
        <button onClick={resetErrorBoundary} type="button">
          Restart.
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
