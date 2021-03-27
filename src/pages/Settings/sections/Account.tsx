/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { FC, ReactElement, useCallback } from "react";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import Button from "components/ui/Button/Button";
import { AiOutlineLoading, BiRefresh } from "react-icons/all";
import { TitleBox } from "../../../components/ui/TitleBox/TitleBox";
import {
  Card,
  CardHeader,
  CardPadding,
  CardSection,
} from "../../../components/ui/Card/Card";
import { Input } from "../../../components/ui/Input/Input";
import styles from "./account.module.scss";
import { useCreateTakeout, useTakeouts } from "../../../hooks/useTakeouts";
import { Loader } from "../../../components/SuspenseLoader/SuspenseLoader";
import ButtonGroup from "../../../components/ui/Button/ButtonGroup";

type Form = { username: string; dataCollection: boolean };

const AccountUpdateForm: FC = () => {
  const user = useSelector((x) => x.user.user);

  if (!user) return null;
  return (
    <Formik<Form>
      initialValues={{
        username: user.username,
        dataCollection: user.dataCollection,
      }}
      validateOnChange
      onSubmit={() => {}}
      validate={({ username }) => {
        const validation: Partial<Form> = {};
        if (username.length > 32 || username.length === 0) {
          validation.username =
            "Your username must be less than 32 characters and must not be empty.";
        }
        return validation;
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        isSubmitting,
        touched,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label title="Your new username" className={styles.label}>
                <span>Your new username</span>
                <Input
                  id="account_update"
                  type="text"
                  name="username"
                  placeholder="Your new username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
                {errors.username && touched.username && (
                  <p>{errors.username}</p>
                )}
              </label>
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                htmlFor="account_update_dataCollection"
                title="Your new username"
                className={styles.label}
              >
                <span>Do you allow data collection from third parties ?</span>
                <Input
                  id="account_update_dataCollection"
                  type="checkbox"
                  name="dataCollection"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dataCollection ? "true" : "false"}
                />
              </label>
              <CardSection>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </CardSection>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const Indicator: FC<{ color: string; key: string }> = ({ color, children }) => {
  return (
    <div className={styles.indicator} style={{ backgroundColor: color }}>
      {children}
    </div>
  );
};

const Takeouts: FC = () => {
  const { isLoading, refetch, isFetching, data, error } = useTakeouts();
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
  if (!data) return null;
  return (
    <Card>
      <CardPadding>
        <CardSection>
          <h4>
            Data management{" "}
            {isFetching && <AiOutlineLoading className="rotate" />}
          </h4>
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

const Account = (): ReactElement => {
  return (
    <div>
      <TitleBox>
        <h2>Account settings</h2>
        <p>Here, you can manage your account settings</p>
      </TitleBox>
      <CardPadding>
        <Card>
          <CardPadding>
            <CardHeader>
              <h4>Profile info</h4>
            </CardHeader>
            <AccountUpdateForm />
          </CardPadding>
        </Card>
      </CardPadding>
      <CardPadding>
        <Takeouts />
      </CardPadding>
    </div>
  );
};

export default Account;
