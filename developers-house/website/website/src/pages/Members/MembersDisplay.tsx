import { groupBy } from "utilities";
import React, { ReactElement } from "react";
import MemberDisplay from "./MemberDisplay";
import { CardFlexContainer, CardHeader } from "components/ui/Card";
import { User } from 'utilities';

export default function MembersList({
    users
}: {
    users: User[];
}): ReactElement {
    return (
        <CardFlexContainer>
            {Array.from(
                groupBy(Object.values(users), (user) => {
                    return user.role;
                })
            ).map(([role, members], index) => {
                return (
                    <CardFlexContainer key={index}>
                        <CardHeader align="center">
                            <p style={{ fontSize: "25px" }}>{role}</p>
                        </CardHeader>
                        {members.map((_, index) => {
                            return <MemberDisplay key={index} />;
                        })}
                    </CardFlexContainer>
                );
            })}
        </CardFlexContainer>
    );
}
