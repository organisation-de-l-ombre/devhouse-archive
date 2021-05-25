import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, ButtonContainer } from "../../components/button";
import { fetchTwoFaSession } from "../../lib/api/2fa";
import { usePageState } from "../../lib/usePageState";
import { TwoFAContext } from "../../contexts/2FAContext";
import { ErrorGate } from "../../components/ErrorGate";

export default function TwoFa(): ReactElement {
  const { error, data, loading, setError, setLoading } = usePageState(
    fetchTwoFaSession
  );
  const [choose, setChoose] = useState<boolean>(false);
  const context = useContext(TwoFAContext);
  const router = useRouter();

  useEffect(() => {
    if (data && data.error === false)
      context.setTwoFaData(() => ({ session: data }));
    // eslint-disable-next-line
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (data.error === false) {
      if (data.otp && data.webauth.availableKeys.length === 0) {
        setLoading(true);
        router.push("/2fa/otp");
        return;
      }
      if (!data.otp && data.webauth.availableKeys.length > 0) {
        setLoading(true);
        router.push("/2fa/webauth");
      }
      if (data.otp && data.webauth.availableKeys.length > 0) {
        setLoading(false);
        setChoose(true);
      }
    } else {
      setError(new Error(data.message));
    }
  }, [data, router, context, setError, setLoading]);

  return (
    <ErrorGate loading={loading} error={error}>
      {choose && (
        <>
          <p>2fa_required</p>
          <ButtonContainer>
            <Link href="/2fa/webauth">
              <Button>private_key</Button>
            </Link>
            <Link href="/2fa/otp">
              <Button>otp</Button>
            </Link>
          </ButtonContainer>
        </>
      )}
    </ErrorGate>
  );
}
