import {groupBy} from "utilities";
import React, {ReactElement} from "react";
import MemberDisplay from "./MemberDisplay";
import {CardFlexContainer, CardHeader} from "components/ui/Card";
import styled from "styled-components";
import {CachedUser} from "./Members";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: 10%;
    padding-right: 10%;
`;

const WrapperMembers = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    flex-grow: 45%;
    justify-content: center;
`;

export default function MembersList({
                                        users
                                    }: {
    users: CachedUser[];
}): ReactElement {
    return (
        <CardFlexContainer>
            {Array.from(
                groupBy(Object.values(users), (user) => {
                    return user.hoistRole;
                })
            ).map(([role, members], index) => {
                return (
                    <Wrapper key={index}>
                        <CardHeader align="center">
                            <p style={{fontSize: "25px"}}>{role}</p>
                        </CardHeader>
                        <WrapperMembers>
                        {members.map((member, index) => {
                            return <MemberDisplay member={member} key={index}/>;
                        })}
                        </WrapperMembers>

                    </Wrapper>
                );
            })}
        </CardFlexContainer>
    );
}
