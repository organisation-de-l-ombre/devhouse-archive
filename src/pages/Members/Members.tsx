import React, { ReactElement } from "react";
import { TitleBox } from "components/ui/TitleBox/TitleBox";
import MemberDisplay from "./MemberDisplay";
import "../transitions.css";
import styles from "./member.module.scss";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";
import useMembers from "../../hooks/useMembers";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import { withNetwork } from "../../hooks/hoc/withNetwork";

const MembersPage = (): ReactElement => {
  const { isLoading, isError, data } = useMembers();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <FlexContainer className={styles.error}>
        <TitleBox>
          <h1>Failed to load the member list.</h1>
          <p>Try again later or try to check our status page.</p>
        </TitleBox>
      </FlexContainer>
    );
  }

  return (
    <div>
      <TitleBox className={styles.title}>
        <h1>Our members</h1>
        <h2>
          <p>
            Thanks to all of our team to have helped to develop and to make
            possible this project! Without these persons below this project
            wouldn&rsquo;t exist.
          </p>
        </h2>
      </TitleBox>

      <div className={styles.grid}>
        {data &&
          data
            .sort((x, y) => y.role.position - x.role.position)
            .map((member) => {
              return (
                <MemberDisplay
                  key={member.id}
                  className={styles.card}
                  member={member}
                />
              );
            })}
      </div>
    </div>
  );
};

export default withNetwork(MembersPage);
