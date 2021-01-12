import React from "react";
import { randomBytes } from "crypto";
import { User } from "../../account/Types";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import UserContext from "../../account/UserContext";
import flexContainerStyles from "../../components/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Account.module.scss";
import Button from "../../components/Button/Button";
import Image from "../../components/Image/Image";
import ButtonsGroup from "../../components/ButtonsGroup/ButtonsGroup";

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
      <FlexContainer
        className={`${globalStyles["primary-padding"]} ${flexContainerStyles.container} ${globalStyles.column} ${styles.menu}`}
      >
        <Image className={globalStyles["rounded-picture"]} src={user.avatar} />
        <h2>{user.username}</h2>
        <ButtonsGroup
          className={`${globalStyles.flex} ${globalStyles.column} ${globalStyles["border-radius"]} ${globalStyles["overflow-hidden"]}`}
        >
          <Button>Testing</Button>
          <Button>Testing</Button>
        </ButtonsGroup>
      </FlexContainer>
      <FlexContainer
        className={`${flexContainerStyles.container} ${styles.content}`}
      >
        {JSON.stringify(user, null, "\t")}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Account;
