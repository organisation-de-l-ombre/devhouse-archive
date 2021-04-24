import React, { ReactElement } from "react";

export default function Error(): ReactElement {
  return (
    <div>
      <h2>Something wrong happened.</h2>
      <p>
        There might be a problem with our system. Check the page you were before
        and report the error to us.
      </p>
    </div>
  );
}
