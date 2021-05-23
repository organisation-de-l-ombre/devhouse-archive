import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loader from "react-loaders";
import { useRouter } from "next/router";
import styles from "../../styles/pages/consent.module.scss";
import { Button } from "../../components/button";
import { TwoFAContext } from "../../contexts/2FAContext";

export default function Login(): ReactElement {
  const { data } = useContext(TwoFAContext);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const element = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/dialog/api/2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          type: "otp",
          code: Number(element.current.value),
        }),
      });

      if (response.ok) {
        const json = await response.json();
        await router.push(json.redirect);
      }
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!data.session) {
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
      <input min={0} max={9999} ref={element} type="number" />
      <br />
      <Button onClick={validate}>Validate</Button>
    </div>
  );
}
