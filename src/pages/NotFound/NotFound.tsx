import React, { ReactElement } from "react";
import Button from "components/ui/Button";
import styled from "styled-components";
import { useHistory } from "react-router";

const NotFoundBase = styled.div`
  display: grid;
  height: 100%;
`;

const NotFoundContent = styled.div`
  margin: auto;
  padding: 1rem;

  h1 {
    font-size: 350%;
  }

  hr {
    margin-right: 15%;
  }
`;

export default function NotFound(): ReactElement {
  const nav = useHistory();
  return (
    <NotFoundBase>
      <NotFoundContent>
        <h1>404</h1>
        <hr />
        <h2>Not found - This page doesn&#39;t exists</h2>
        <p>We couldn&#39;t find this page on this application.</p>
        <Button onClick={() => nav.push("/")}>Return home</Button>
      </NotFoundContent>
    </NotFoundBase>
  );
}
