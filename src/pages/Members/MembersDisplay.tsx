import {groupBy, ProjectMember} from "utilities";
import React, {ReactElement} from "react";
import MemberDisplay from "./MemberDisplay";
import {CardFlexContainer, CardHeader} from "components/ui/Card";
import styled from "styled-components";

const Container = styled.div`
    display: grid;
    grid-gap: 10px;
    
    grid-template-columns: auto repeat(3, 1fr) auto;
`

export default function MembersList({
    users
}: {
    users: ProjectMember[];
}): ReactElement {
    return (
        <CardFlexContainer>
            {Array.from(
                groupBy(Object.values(users), (user) => {
                    return user.role;
                })
            ).map(([role, members], index) => {
                return (
                    <Container key={index}>
                        <CardHeader align="center">
                            <p style={{ fontSize: "25px" }}>{role}</p>
                        </CardHeader>
                        {members.map((member, index) => {
                            return <MemberDisplay member={member} key={index} />;
                        })}
                    </Container>
                );
            })}
        </CardFlexContainer>
    );
}
