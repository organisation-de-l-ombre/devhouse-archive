import React, { FC, useCallback, useState } from "react";
import { Formik } from "formik";
import { Button } from "@components/new/Button/Button";
import { arrayBufferToBase64, requestKeyAdd } from "@utilities/webauthn";
import { Stack } from "@components/new/Stack/Stack";
import { Loader } from "@components/new/Loader";
import { Card } from "@components/new/Card/Card";
import { Input } from "@components/Input/Input";
import { useUser } from "@state/slices/account/hooks";
import { randomString } from "@utilities/index";
import { Header } from "@components/Header";
import styles from "./account.module.scss";

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
              <div>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

const WebAuthn: FC = () => {
  const user = useUser();

  const [addLoading, setAddLoading] = useState<boolean>(false);
  const add = useCallback(async () => {
    if (!user) return;
    setAddLoading(true);
    // Reteive id from server.
    const id = randomString();
    const key = await requestKeyAdd(id, user).catch(() => null);

    if (!key) {
      // eslint-disable-next-line no-alert
      alert("Failed to register the key.");
      setAddLoading(false);
      return;
    }

    const data = key.response as AuthenticatorAttestationResponse;
    // eslint-disable-next-line no-console
    console.log({
      key: key?.id,
      clientData: JSON.parse(new TextDecoder().decode(data.clientDataJSON)),
      attestationObject: arrayBufferToBase64(data.attestationObject),
    });
    setAddLoading(false);
  }, [user]);

  if (!user) return null;

  return (
    <Card>
      <h2>WebAuth</h2>
      <Button disabled={addLoading} onClick={add}>
        Add auth
        {addLoading && (
          <div css={{ margin: "0.5rem" }}>
            <Loader />
          </div>
        )}
      </Button>

      <Stack />
    </Card>
  );
};

const Account: FC = () => {
  return (
    <Stack>
      <Header>
        <h2>Account settings</h2>
        <p>Here, you can manage your account settings</p>
      </Header>
      <Card>
        <div>
          <h4>Profile info</h4>
        </div>
        <AccountUpdateForm />
      </Card>
      <WebAuthn />
    </Stack>
  );
};

export default Account;
