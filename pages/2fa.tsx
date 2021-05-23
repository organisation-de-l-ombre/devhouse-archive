import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Loader from "react-loaders";
import styles from "../styles/pages/consent.module.scss";
import { Button, ButtonContainer } from "../components/button";
import { fetchTwoFaSession } from "../lib/api/2fa";
import { usePageState } from "../lib/usePageState";
import { TwoFAContext } from "../contexts/2FAContext";

export default function TwoFa(): ReactElement {
  const { error, data, loading } = usePageState(fetchTwoFaSession);
  const [choose, setChoose] = useState<boolean>(false);
  const context = useContext(TwoFAContext);
  const router = useRouter();

  useEffect(() => {
    if (!data) return;
    context.setTwoFaData(() => ({ session: data }));
    if (data.otp && data.webauth.availableKeys.length === 0) {
      router.push("/dialog/otp");
      return;
    }
    if (!data.otp && data.webauth.availableKeys.length > 0) {
      router.push("/dialog/2fa");
    }
    if (data.otp && data.webauth.availableKeys.length > 0) {
      setChoose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, router]);

  if (loading) {
    return (
      <div className={styles["loader-root"]}>
        <Loader type="line-scale" innerClassName={styles.loader} active />
        <p>Loading the resource you requested...</p>
      </div>
    );
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  if (choose) {
    return (
      <div>
        <p>2fa_required</p>
        <ButtonContainer>
          <Link href="/webauth">
            <Button>private_key</Button>
          </Link>
          <Link href="/otp">
            <Button>otp</Button>
          </Link>
        </ButtonContainer>
      </div>
    );
  }
}
