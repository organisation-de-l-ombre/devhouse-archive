/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { FallbackProps } from "react-error-boundary";
import globalStyles from "../styles/Global.module.scss";
import FlexContainer from "../components/FlexContainer/FlexContainer";
import { Button } from "../components/Button/Button";
import { Card, CardPadding } from "../components/Card/Card";

const ErrorPage = (props: unknown & FallbackProps): ReactElement => {
  const { resetErrorBoundary } = props;
  return (
    <FlexContainer className={globalStyles["container-align-full-center"]}>
      <Card className={globalStyles["fit-content"]}>
        <CardPadding>
          <h1>Oops... The page just crashed...</h1>
          <p>
            Try refreshing the page. <br />
            If the problem persists, update your browser to the latest version.
            The error has been reported to our team.
          </p>
          <Button onClick={resetErrorBoundary}>Reload page</Button>
        </CardPadding>
      </Card>
    </FlexContainer>
  );
};

export default ErrorPage;
