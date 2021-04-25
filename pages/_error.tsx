import React, { ReactElement } from "react";
import { useRouter } from "next/router";

export default function Error(): ReactElement {
  const router = useRouter();
  const error =
    router.query.error_message || router.query.error || router.query.message;
  return (
    <div>
      <h2>Something wrong happened.</h2>
      <p>
        There might be a problem with our system. Check the page you were before
        and report the error to us.
        <br />
        {error && <code>{error}</code>}
      </p>
    </div>
  );
}
