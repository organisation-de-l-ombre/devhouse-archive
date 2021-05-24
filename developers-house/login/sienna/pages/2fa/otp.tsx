import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { Button } from "../../components/button";
import { TwoFAContext } from "../../contexts/2FAContext";
import { submitTwoFaSessionOTP } from "../../lib/api/2fa";
import { ErrorGate } from "../../components/ErrorGate";

export default function Login(): ReactElement {
  const { data } = useContext(TwoFAContext);
  const [error, setError] = useState<Error>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const element = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await submitTwoFaSessionOTP(
        Number(element.current.value)
      );
      if (response.error === false) {
        await router.push(response.redirect);
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

  return (
    <ErrorGate loading={loading} error={error}>
      <p>You need a code from your phone lmao</p>
      <input min={0} max={9999} ref={element} type="number" />
      <br />
      <Button onClick={validate}>Validate</Button>
    </ErrorGate>
  );
}
