import React, { ReactElement } from "react";
import { CardFlexContainer } from "components/ui/Card";
import styled from "styled-components";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CachedUser } from "./Members";
import MemberDisplay from "./MemberDisplay";
import "../../components/notifications/animations.css";

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  padding: 1vw;
`;

export default function MembersList({
  users,
}: {
  users: CachedUser[];
}): ReactElement {
  return (
    <CardFlexContainer>
      <TransitionGroup>
        <CSSTransition classNames="lst-not" timeout={500}>
          <Wrapper>
            {users
              .sort((x, y) => y.hoistRole.position - x.hoistRole.position)
              .map((member) => {
                return <MemberDisplay member={member} key={member.id} />;
              })}
          </Wrapper>
        </CSSTransition>
      </TransitionGroup>
    </CardFlexContainer>
  );
}
