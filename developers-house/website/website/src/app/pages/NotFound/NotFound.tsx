import React, {ReactElement} from "react";
import Button from "../../../components/ui/Button";
import {NavLink} from "react-router-dom";
import styled from "styled-components";

const NotFoundBase = styled.div`
  display: grid;
  height: 100vh;
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

export default function NotFound (): ReactElement {
    return (
        <NotFoundBase>
            <NotFoundContent>
                <h1>404</h1>
                <hr/>
                <h2>Not found - This page doesn't exists</h2>
                <p>We couldn't find this page on this application.</p>
                <Button as={NavLink} to="/">
                    Return home
                </Button>
            </NotFoundContent>
        </NotFoundBase>
    );
}
