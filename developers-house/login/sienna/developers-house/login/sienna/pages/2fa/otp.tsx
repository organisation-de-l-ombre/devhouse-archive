import React, {
  FormEvent,
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
  const [message, setMessage] = useState<string>(null);

  const element = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validate = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      try {
        const response = await submitTwoFaSessionOTP(
          Number(element.current.value)
        );

        if (response.error === false) {
          await router.push(response.redirect);
        } else {
          setMessage(response.message);
          setLoading(false);
        }
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (!data.session) {
      setError(new Error("Invalid session."));
    }
  }, [data]);

  return (
    <ErrorGate loading={loading} error={error}>
      <p>
        To finalize the authentication, please enter your 6-digit authentication
        code. Use the one from your authentication application or from your
        backup codes.
      </p>
      <form style={{ marginTop: "1rem" }} onSubmit={validate}>
        <input
          minLength={6}
          maxLength={6}
          min={0}
          max={999999}
          ref={element}
          type="number"
        />
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
        <Button type="submit">Validate</Button>
      </form>
    </ErrorGate>
  );
}
