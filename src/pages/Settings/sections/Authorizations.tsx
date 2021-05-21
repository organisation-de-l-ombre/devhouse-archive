import React, { ReactElement } from "react";
import { AiOutlineLoading, BiRefresh, BiTrash } from "react-icons/all";
import { Authorization } from "@developers-house/abdera";
import { TitleBox } from "../../../components/TitleBox/TitleBox";
import { Button } from "../../../components/Button/Button";
import { Loader } from "../../../components/SuspenseLoader/SuspenseLoader";
import {
  Card,
  CardFlexContainer,
  CardHeader,
  CardPadding,
  CardSection,
} from "../../../components/Card/Card";
import {
  useAuthorizedApps,
  useAuthorizedAppsAllDelete,
  useAuthorizedAppsDeleteMutation,
} from "../../../hooks/useAuthorizedApps";
import ButtonGroup from "../../../components/Button/ButtonGroup";
import globalStyles from "../../../styles/Global.module.scss";

const AuthorizationsCard: React.FC<{
  client: Authorization;
}> = ({ client }) => {
  const { remove } = useAuthorizedAppsDeleteMutation(client.client.id);

  const date = new Date(client.grantedAt);
  const dateString = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  return (
    <Card className={globalStyles["card-margin"]}>
      <CardPadding>
        <CardHeader>
          <b>{client.client.name || client.client.id}</b>
        </CardHeader>
        <CardSection>
          The permission was accorded on {dateString} for the audiences{" "}
          <code>{(client.audiences || []).join(" ")}</code> with the
          authorizations <code>{(client.scopes || []).join(" ")}</code>
        </CardSection>
        <CardSection>
          <Button onClick={() => remove()}>Revoke</Button>
        </CardSection>
      </CardPadding>
    </Card>
  );
};

const Authorizations = (): ReactElement => {
  const { data, error, refetch, isLoading, isFetching } = useAuthorizedApps();
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
        <p>
          {error.name}: {error.message} <br /> {error.stack}
        </p>
      </TitleBox>
    );
  }
  return (
    <>
      <CardPadding>
        <TitleBox>
          <h3>
            Authorizations manager{" "}
            {isFetching && <AiOutlineLoading className="rotate" />}
          </h3>
          <p>
            This is the list of the authorized applications in your account (
            {data?.length})
          </p>
        </TitleBox>
        <ButtonGroup>
          <Button onClick={() => !isFetching && refetch()}>
            Refresh <BiRefresh />
          </Button>
          <Button onClick={() => deleteAll()}>
            Revoke all <BiTrash />
          </Button>
        </ButtonGroup>
      </CardPadding>
      <CardFlexContainer>
        {data?.map((client) => {
          return <AuthorizationsCard client={client} key={client.client.id} />;
        })}
      </CardFlexContainer>
    </>
  );
};

export default Authorizations;
