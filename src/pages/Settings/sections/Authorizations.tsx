/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { BiRefresh, BiTrash } from "react-icons/all";
import { TitleBox } from "../../../components/ui/TitleBox";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/SuspenseLoader";
import {
  CardFlexContainer,
  CardHeader,
  CardPadding,
  CardSection,
} from "../../../components/ui/Card";
import {
  Client,
  useAuthorizedApps,
  useAuthorizedAppsAllDelete,
  useAuthorizedAppsDeleteMutation,
} from "../../../hooks/useAuthorizedApps";
import ButtonGroup from "../../../components/ui/ButtonGroup";

const AuthorizationsCard: React.FC<{
  client: Client;
}> = ({ client }) => {
  const { remove } = useAuthorizedAppsDeleteMutation(client.client_id);

  const date = new Date(client.grantedAt);
  const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return (
    <CardPadding>
      <CardHeader>
        <b>{client.client_name || client.client_id}</b>
      </CardHeader>
      <CardSection>
        The permission was accorded on {dateString} for the audiences{" "}
        <code>{client.audiences.join(" ")}</code> with the authorizations{" "}
        <code>{client.scopes.join(" ")}</code>
      </CardSection>
      <CardSection>
        <Button onClick={() => remove()}>Revoke</Button>
      </CardSection>
    </CardPadding>
  );
};

const Authorizations = (): ReactElement => {
  const { data, error, refetch, isLoading } = useAuthorizedApps();
  const deleteAll = useAuthorizedAppsAllDelete();

  if (isLoading) {
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
      <CardPadding>
        <TitleBox>
          <h3>Authorizations manager</h3>
          <p>
            This is the list of the authorized applications in your account (
            {data?.length})
          </p>
        </TitleBox>
        <ButtonGroup>
          <Button onClick={() => refetch()}>
            Refresh <BiRefresh />
          </Button>
          <Button onClick={() => deleteAll()}>
            Revoke all <BiTrash />
          </Button>
        </ButtonGroup>
      </CardPadding>
      <CardFlexContainer>
        {data?.map((client, i) => {
          return (
            <>
              <AuthorizationsCard
                client={client}
                key={client.grantedAt.toString()}
              />
              {i !== data?.length - 1 && <hr style={{ flex: 1 }} />}
            </>
          );
        })}
      </CardFlexContainer>
    </>
  );
};

export default Authorizations;
