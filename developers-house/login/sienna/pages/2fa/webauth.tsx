import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Loader from "react-loaders";
import styles from "../../styles/pages/consent.module.scss";
import { askWebAuthLogin } from "../../lib/api/webauth";
import { Button } from "../../components/button";
import { TwoFAContext } from "../../contexts/2FAContext";

export default function Login(): ReactElement {
  const { data } = useContext(TwoFAContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);

  const doLogin = useCallback(() => {
    setLoading(true);
    askWebAuthLogin({
      challenge: data.session.webauth.challenge,
      credentials: data.session.webauth.availableKeys,
    })
      .then(console.log)
      .catch(() => {
        alert("Failed to login using this device.");
        setLoading(false);
        setRetry(true);
      });
  }, [data]);

  useEffect(() => {
    if (!data) {
      setError(new Error("Invalid session."));
      return;
    }
    doLogin();
  }, [doLogin, data]);

  if (error) {
    return <p>{error.message}</p>;
  }

  if (loading || !retry) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  return (
    <div>
      <p>
        Hey {data.session.username} you need to use your secret key to login.
      </p>
      <Button onClick={doLogin}>Login using my private key.</Button>
    </div>
  );
}
