import React, { FC, ReactElement, useCallback } from "react";
import { AiOutlineLoading, BiRefresh } from "react-icons/all";
import { useCreateTakeout, useTakeouts } from "../../../hooks/useTakeouts";
import { TitleBox } from "../../../components/TitleBox/TitleBox";
import { Loader } from "../../../components/SuspenseLoader/SuspenseLoader";
import { Card, CardPadding, CardSection } from "../../../components/Card/Card";
import ButtonGroup from "../../../components/Button/ButtonGroup";
import styles from "./account.module.scss";
import { Button } from "../../../components/Button/Button";

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
    return (
      <Card>
        <TitleBox>
          <Loader />
        </TitleBox>
      </Card>
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
  if (!data) return null;
  return (
    <Card>
      <CardPadding>
        <CardSection>
          <h4>
            Takeouts requests
            {isFetching && <AiOutlineLoading className="rotate" />}
          </h4>
          <p>
            Here are your pending takeout requests, each takeout is available
            during one week and contains all the data across all the
            Developer&rsquo; services. If you have any question, you can contact
            us on the contact page.
          </p>
        </CardSection>
        <div style={{ marginTop: "2.5%", marginBottom: "2.5%" }}>
          <ButtonGroup>
            <Button onClick={() => refetch()}>
              <BiRefresh />
            </Button>
            <Button onClick={create}>Request your data</Button>
          </ButtonGroup>
        </div>

        {data.map((dat) => {
          return (
            <div key={dat.uuid}>
              <hr />
              <h4>{dat.uuid}</h4>
              <CardSection>
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
              </CardSection>
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
      </CardPadding>
    </Card>
  );
};

const AccountDeletion: FC = () => {
  return (
    <Card>
      <CardPadding>
        <CardSection>
          <h4>Account deletion</h4>
        </CardSection>
        <div style={{ marginTop: "2.5%", marginBottom: "2.5%" }}>
          <ButtonGroup>
            <Button>Delete your account</Button>
          </ButtonGroup>
        </div>
      </CardPadding>
    </Card>
  );
};

const DataSettings = (): ReactElement => {
  return (
    <div>
      <TitleBox>
        <h2>Privacy settings</h2>
        <p>
          We need to have some data about to make our systems function, you can
          view or manage your information stored on Developer&rsquo; by issuing
          data takeouts requests or by issuing a a data deletion request.
        </p>
      </TitleBox>
      <CardPadding>
        <Takeouts />
      </CardPadding>

      <CardPadding>
        <AccountDeletion />
      </CardPadding>
    </div>
  );
};

export default DataSettings;
