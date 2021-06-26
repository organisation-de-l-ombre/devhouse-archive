import React, { ReactElement } from "react";
import { Button } from "@components/new/Button/Button";
import { useHistory } from "react-router";
import CenteredMessage from "@components/CenteredMessage/CenteredMessage";
import { Metadata } from "@components/Meta/Metadata";

export default function NotFound(): ReactElement {
  const nav = useHistory();

  return (
    <CenteredMessage title="404">
      <Metadata
        title="Not found | Developer's House"
        description="We couldn't find this page on this application."
      />
      <p>We couldn&#39;t find this page on this application.</p>
      <Button onClick={() => nav.push("/")}>Return home</Button>
    </CenteredMessage>
  );
}
