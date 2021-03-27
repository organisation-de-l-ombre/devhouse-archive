import React, { ReactElement } from "react";
import { TitleBox } from "components/ui/TitleBox/TitleBox";
import { TypeWriter } from "components/TypeWriter/TypeWriter";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Button } from "../../components/ui/Button/Button";
import { CardFlexContainer } from "../../components/ui/Card/Card";
import MemberDisplay from "./MemberDisplay";
import "../transitions.css";
import styles from "./member.module.scss";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";
import globalStyles from "../../styles/Global.module.scss";
import useMembers from "../../hooks/Members/Members";
import FlexContainer from "../../components/FlexContainer/FlexContainer";

const MembersPage = (): ReactElement => {
  const { isLoading, isError, refetch, data } = useMembers();

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
      <TitleBox>
        <h1>Our members</h1>
        <h2>
          <TypeWriter characterDisplayInterval={100}>
            Thanks to all of our team to have helped to develop and to make
            possible this project! Without these persons below this project
            wouldn&rsquo;t exist.
          </TypeWriter>
        </h2>
        <Button onClick={() => refetch()}>Refresh</Button>
      </TitleBox>

      <CardFlexContainer>
        <TransitionGroup className={styles.wrapper}>
          {data ? (
            data
              .sort((x, y) => y.role.position - x.role.position)
              .map((member) => {
                return (
                  <CSSTransition
                    classNames="fade"
                    timeout={500}
                    key={member.id}
                  >
                    <MemberDisplay
                      className={globalStyles["card-margin"]}
                      member={member}
                    />
                  </CSSTransition>
                );
              })
          ) : (
            <></>
          )}
        </TransitionGroup>
      </CardFlexContainer>
    </div>
  );
};

export default MembersPage;
