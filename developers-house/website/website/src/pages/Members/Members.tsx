import React, { ReactElement } from "react";
import "../transitions.css";
import { Loader } from "@components/SuspenseLoader/SuspenseLoader";
import useMembers from "@hooks/useMembers";
import FlexContainer from "@components/FlexContainer/FlexContainer";
import { withNetwork } from "@hooks/hoc/withNetwork";
import { Header } from "@components/Header";
import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import MemberDisplay from "./MemberDisplay";
import styles from "./member.module.scss";

const MembersPage = (): ReactElement => {
  const { isLoading, isError, data } = useMembers();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <FlexContainer className={styles.error}>
        <Header>
          <h1>Failed to load the member list.</h1>
          <p>Try again later or try to check our status page.</p>
        </Header>
      </FlexContainer>
    );
  }

  return (
    <div>
      <Header>
        <h1>Our members</h1>
        <h2>
          <p>
            Thanks to all of our team to have helped to develop and to make
            possible this project! Without these persons below this project
            wouldn&rsquo;t exist.
          </p>
        </h2>
      </Header>

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

export default withGate(withNetwork(MembersPage), "feature_members");
