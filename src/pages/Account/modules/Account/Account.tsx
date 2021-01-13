import React from "react";
import { randomBytes } from "crypto";
import { User } from "../../../../account/Types";
import UserContext from "../../../../account/UserContext";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";

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

  return (
    <FlexContainer>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis,
        sint? Doloribus illum consectetur non. Natus qui, ullam quam ipsa cumque
        incidunt quas blanditiis facilis exercitationem? Beatae, magni itaque!
        Sint, maxime!
      </p>
    </FlexContainer>
  );
};

export default Account;
