import React, { ReactElement } from "react";
import { Header } from "@components/Header";

const Support = (): ReactElement => {
  return (
    <Header>
      <p style={{ padding: "3rem" }}>
        The core login system is not finished yet. If you want to retrieve or
        delete your account / account data. You can post your request by{" "}
        <a href="mailto:matthieu@developershouse.xyz">e-mail</a> or by joining
        our discord server.
      </p>
    </Header>
  );
};

export default Support;
