/*
 * The Error page displayed to the user when the website crashes.
 */

import React, { ReactElement } from "react";
import { TitleBox } from "../../../components/TitleBox/TitleBox";

const Support = (): ReactElement => {
  return (
    <TitleBox>
      <p style={{ padding: "3rem" }}>
        The core login system is not finished yet. If you want to retrieve or
        delete your account / account data. You can post your request by{" "}
        <a href="mailto:matthieu@developershouse.xyz">e-mail</a> or by joining
        our discord server.
      </p>
    </TitleBox>
  );
};

export default Support;
