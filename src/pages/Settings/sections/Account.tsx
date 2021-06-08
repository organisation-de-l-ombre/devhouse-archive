/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { FC, ReactElement } from "react";
import { Formik } from "formik";
import Button from "components/Button/Button";
import { TitleBox } from "../../../components/TitleBox/TitleBox";
import {
  Card,
  CardHeader,
  CardPadding,
  CardSection,
} from "../../../components/Card/Card";
import { Input } from "../../../components/Input/Input";
import styles from "./account.module.scss";
import { useUser } from "../../../state/slices/account/hooks";

type Form = { username: string; dataCollection: boolean };

const AccountUpdateForm: FC = () => {
  const user = useUser();

  if (!user) return null;
  return (
    <Formik<Form>
      initialValues={{
        username: user.username as string,
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
    </div>
  );
};

export default Account;
