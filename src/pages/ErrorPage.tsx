/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { FallbackProps } from "react-error-boundary";
import { Metadata } from "@components/Meta/Metadata";
import { usePreload } from "@components/PreloadContext/PreloadContext";
import globalStyles from "../styles/Global.module.scss";
import FlexContainer from "../components/FlexContainer/FlexContainer";
import { Button } from "../components/new/Button/Button";
import { Card } from "../components/new/Card/Card";

const ErrorPage = (props: unknown & FallbackProps): ReactElement => {
  const { resetErrorBoundary } = props;
  return (
    <FlexContainer className={globalStyles["container-align-full-center"]}>
      <Metadata
        title="Error | Developer's House"
        description="This page is not currently available."
      />
      <Card className={globalStyles["fit-content"]}>
        <h1>Oops... The page just crashed...</h1>
        <p>
          Try refreshing the page. <br />
          If the problem persists, update your browser to the latest version.
          The error has been reported to our team.
        </p>
        <Button onClick={resetErrorBoundary}>Reload page</Button>
      </Card>
    </FlexContainer>
  );
};

export default ErrorPage;
