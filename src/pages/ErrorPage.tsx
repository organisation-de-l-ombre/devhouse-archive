/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import styled from "styled-components";
import { FallbackProps } from "react-error-boundary";

const ErrorPageStructure = (props: unknown & FallbackProps): ReactElement => {
  const { resetErrorBoundary } = props;
  return (
    <div id="error-container" {...props}>
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

const ErrorPage = styled(ErrorPageStructure)`
  display: flex;
  justify-content: center;
  vertical-align: middle;
  height: 100vh;
  align-items: center;
  background-color: #141414;
  color: white;
`;

export default ErrorPage;
