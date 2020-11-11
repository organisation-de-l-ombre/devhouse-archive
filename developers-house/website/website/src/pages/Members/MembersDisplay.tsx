import React, {ReactElement} from "react";
import MemberDisplay from "./MemberDisplay";
import {CardFlexContainer} from "components/ui/Card";
import styled from "styled-components";
import {CachedUser} from "./Members";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import "../../components/notifications/animations.css";

const Wrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
`;

export default function MembersList({
                                        users
                                    }: {
    users: CachedUser[];
}): ReactElement {
    return (
        <CardFlexContainer>
            <TransitionGroup>
                <CSSTransition classNames={"lst-not"} timeout={500}>
                    <Wrapper>
                        {users.sort((x,y) => y.hoistRole.position - x.hoistRole.position).map((member, index) => {
                            return <MemberDisplay member={member} key={index}/>;
                        })}

                    </Wrapper>
                </CSSTransition>
            </TransitionGroup>
        </CardFlexContainer>
    );
}
