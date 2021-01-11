import React from "react";
import { randomBytes } from "crypto";
import { User } from "../../account/Types";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import UserContext from "../../account/UserContext";

const Account = (): React.ReactElement => {
  const userDefault: User = {
    avatar: "test",
    dataCollection: true,
    premium: false,
    private: false,
    roles: 0,
    sid: "123456789",
    sub: "123456789",
    token: randomBytes(32).toString("hex"),
    username: "Kylian",
  };
  const { user: userFetched } = React.useContext(UserContext);
  const user: User = userFetched !== null ? userFetched : userDefault;

  return <FlexContainer>{JSON.stringify(user, null, "\t")}</FlexContainer>;
};

export default Account;
