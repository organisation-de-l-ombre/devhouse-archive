/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { BiRefresh, BiTrash } from "react-icons/all";
import { TitleBox } from "../../../components/ui/TitleBox";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/SuspenseLoader";
import {
  Card,
  CardFlexContainer,
  CardHeader,
  CardPadding,
  CardSection,
} from "../../../components/ui/Card";

type Authorization = {
  name: string;
  id: string;
  at: string;
  scopes: string[];
  audience: string[];
};

const fetchAuthorizations = async (): Promise<Authorization[]> => {
  const { data } = await axios.get(
    "https://developers-house-dev-website-group-abdera.matthieu-dev.xyz/users/consents"
  );
  return data;
};

const AuthorizationsCard: React.FC<{
  client: Authorization;
  refetch: () => unknown;
}> = ({ client, refetch }) => {
  const remove = () => {
    refetch();
  };
  const date = new Date(client.at);
  const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return (
    <Card>
      <CardPadding>
        <CardHeader>
          <b>{client.name || client.id}</b>
        </CardHeader>
        <CardSection>
          The permission was accorded on {dateString} for the audiences{" "}
          <code>{client.audience.join(" ")}</code> with the authorizations{" "}
          <code>{client.scopes.join(" ")}</code>
        </CardSection>
        <CardSection>
          <Button onClick={remove}>Revoke</Button>
        </CardSection>
      </CardPadding>
    </Card>
  );
};

const Authorizations = (): ReactElement => {
  const { data, error, refetch, isFetching } = useQuery(
    "user-auth",
    fetchAuthorizations
  );

  if (isFetching) {
    return (
      <TitleBox>
        <Loader />
      </TitleBox>
    );
  }
  if (error) {
    return (
      <TitleBox>
        <p>{JSON.stringify(error)}</p>
      </TitleBox>
    );
  }
  return (
    <>
      <TitleBox>
        <h3>Authorizations manager</h3>
        <p>
          This is the list of the authorized applications in your account (
          {data?.length})
        </p>
        <Button onClick={() => refetch()}>
          Refresh <BiRefresh />
        </Button>{" "}
        <Button onClick={() => refetch()}>
          Revoke all <BiTrash />
        </Button>
        <br />
        <br />
      </TitleBox>
      <CardPadding>
        <CardFlexContainer>
          {data?.map((client) => {
            return (
              <AuthorizationsCard
                client={client}
                key={client.at}
                refetch={refetch}
              />
            );
          })}
        </CardFlexContainer>
      </CardPadding>
    </>
  );
};

export default Authorizations;
