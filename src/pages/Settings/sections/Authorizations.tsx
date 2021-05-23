import React, { ReactElement } from "react";
import { AiOutlineLoading, BiRefresh, BiTrash } from "react-icons/all";
import { Authorization } from "@developers-house/abdera";
import { Stack } from "components/new/Stack/Stack";
import { Section } from "components/new/Section/Section";
import { TitleBox } from "../../../components/TitleBox/TitleBox";
import { Button } from "../../../components/new/Button/Button";
import { Loader } from "../../../components/SuspenseLoader/SuspenseLoader";
import { Card } from "../../../components/new/Card/Card";
import {
  useAuthorizedApps,
  useAuthorizedAppsAllDelete,
  useAuthorizedAppsDeleteMutation,
} from "../../../hooks/useAuthorizedApps";
import ButtonGroup from "../../../components/new/Button/ButtonGroup";

const AuthorizationsCard: React.FC<{
  client: Authorization;
}> = ({ client }) => {
  const { remove } = useAuthorizedAppsDeleteMutation(client.client.id);

  const date = new Date(client.grantedAt);
  const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return (
    <Card>
      <div>
        <b>{client.client.name || client.client.id}</b>
      </div>
      <div>
        The permission was accorded on {dateString} for the audiences{" "}
        <code>{(client.audiences || []).join(" ")}</code> with the
        authorizations <code>{(client.scopes || []).join(" ")}</code>
      </div>
      <div>
        <Button onClick={() => remove()}>Revoke</Button>
      </div>
    </Card>
  );
};

const Authorizations = (): ReactElement => {
  const { data, error, refetch, isLoading, isFetching } = useAuthorizedApps();
  const deleteAll = useAuthorizedAppsAllDelete();

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    return (
      <p>
        {error.name}: {error.message} <br /> {error.stack}
      </p>
    );
  }
  return (
    <Stack>
      <TitleBox>
        <Section>
          <h3>
            Authorizations manager{" "}
            {isFetching && <AiOutlineLoading className="rotate" />}
          </h3>
          <p>
            This is the list of the authorized applications in your account (
            {data?.length})
          </p>
        </Section>
        <ButtonGroup>
          <Button onClick={() => !isFetching && refetch()}>
            Refresh <BiRefresh />
          </Button>
          <Button onClick={() => deleteAll()}>
            Revoke all <BiTrash />
          </Button>
        </ButtonGroup>
      </TitleBox>
      {data?.map((client) => {
        return <AuthorizationsCard client={client} key={client.client.id} />;
      })}
    </Stack>
  );
};

export default Authorizations;
