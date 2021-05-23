import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loader from "react-loaders";
import styles from "../styles/pages/consent.module.scss";
import { Button } from "../components/button";
import { TwoFAContext } from "../contexts/2FAContext";

export default function Login(): ReactElement {
  const { data } = useContext(TwoFAContext);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const element = useRef<HTMLInputElement>(null);

  const validate = useCallback(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    if (!data) {
      setError(new Error("Invalid session."));
    }
  }, [data]);

  if (error) {
    return <p>{error.message}</p>;
  }

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  return (
    <div>
      <p>You need a code from your phone lmao</p>
      <input ref={element} type="number" />
      <Button onClick={validate}>Validate</Button>
    </div>
  );
}
