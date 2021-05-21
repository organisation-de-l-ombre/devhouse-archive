import React, { ReactElement } from "react";
import Button from "components/Button/Button";
import { useHistory } from "react-router";
import CenteredMessage from "../../components/CenteredMessage/CenteredMessage";

export default function NotFound(): ReactElement {
  const nav = useHistory();

  return (
    <CenteredMessage title="404">
      <p>We couldn&#39;t find this page on this application.</p>
      <Button onClick={() => nav.push("/")}>Return home</Button>
    </CenteredMessage>
  );
}
