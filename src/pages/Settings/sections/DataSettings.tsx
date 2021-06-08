import React, { FC, ReactElement, useCallback } from "react";
import { AiOutlineLoading, BiRefresh } from "react-icons/all";
import { Stack } from "@components/new/Stack/Stack";
import { useCreateTakeout, useTakeouts } from "@hooks/useTakeouts";
import { Loader } from "@components/SuspenseLoader/SuspenseLoader";
import { Card } from "@components/new/Card/Card";
import ButtonGroup from "@components/new/Button/ButtonGroup";
import { Button } from "@components/new/Button/Button";
import { Header } from "@components/Header";
import styles from "./account.module.scss";

const Indicator: FC<{ color: string; key: string }> = ({ color, children }) => {
  return (
    <div className={styles.indicator} style={{ backgroundColor: color }}>
      {children}
    </div>
  );
};

const Takeouts: FC = () => {
  const { refetch, isFetching, data, error } = useTakeouts();
  const createTakeout = useCreateTakeout();
  const create = useCallback(() => {
    // eslint-disable-next-line no-alert
    const validated = window.confirm(
      "Are you sure you want to request a data takeout ?"
    );
    if (validated) {
      createTakeout();
    }
  }, [createTakeout]);
  if (isFetching) {
    return <Loader />;
  }
  if (error) {
    return (
      <p>
        {error.name}: {error.message} <br /> {error.stack}
      </p>
    );
  }
  if (!data) return null;
  return (
    <Stack>
      <h4>
        Takeouts requests
        {isFetching && <AiOutlineLoading className="rotate" />}
      </h4>
      <p>
        Here are your pending takeout requests, each takeout is available during
        one week and contains all the data across all the Developer&rsquo;
        services. If you have any question, you can contact us on the contact
        page.
      </p>
      <ButtonGroup>
        <Button onClick={() => refetch()}>
          <BiRefresh />
        </Button>
        <Button onClick={create}>Request your data</Button>
      </ButtonGroup>

      {data.map((dat) => {
        return (
          <div key={dat.uuid}>
            <hr />
            <h4>{dat.uuid}</h4>
            <div>
              Status: {dat.status} <br />
              Expires in {dat.expire} seconds. <br />
              Includes:
              {dat.services ? (
                dat.services.map((service) => {
                  return (
                    <Indicator
                      key={`${service.name}${dat.uuid}`}
                      color={
                        service.status === "finished" ? "#6dab49" : "#9b9946"
                      }
                    >
                      {service.name}
                    </Indicator>
                  );
                })
              ) : (
                <></>
              )}
            </div>
            {dat.link && (
              <a href={dat.link} rel="noopener noreferrer">
                <Button>Download</Button>
              </a>
            )}
          </div>
        );
      })}
      {data.length === 0 && (
        <div className={styles.centered}>
          <p>No data takeouts available</p>
        </div>
      )}
    </Stack>
  );
};

const AccountDeletion: FC = () => {
  return (
    <Stack wrap direction="row">
      <h4>Account deletion</h4>
      <p>
        If you need to, you can request an account deletion this process deletes
        your account on all the Developer&rsquo;s House services and products.
        All your data and settings will be deleted.
      </p>
      <ButtonGroup>
        <Button>Delete your account</Button>
      </ButtonGroup>
    </Stack>
  );
};

const DataSettings = (): ReactElement => {
  return (
    <Stack>
      <Header>
        <h2>Privacy settings</h2>
        <p>
          We need to have some data about to make our systems function, you can
          view or manage your information stored on Developer&rsquo; by issuing
          data takeouts requests or by issuing a a data deletion request.
        </p>
      </Header>
      <Card>
        <Takeouts />
      </Card>
      <Card>
        <AccountDeletion />
      </Card>
    </Stack>
  );
};

export default DataSettings;
