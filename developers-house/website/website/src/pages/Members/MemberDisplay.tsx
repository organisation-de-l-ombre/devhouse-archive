import React, {ComponentProps, ReactElement} from "react";
import styled from "styled-components";
import {Card, CardPadding, CardHeader, CardSection} from "components/ui/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus";
import {getAvatar, ProjectMember, statusToColor} from "../../utilities";
import ButtonGroup from "../../components/ui/ButtonGroup";

const UserCardName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  flex: 1;
  flex-wrap: wrap;
  padding-left: 1.5rem;
`;

const LogosInline = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
  vertical-align: center;
`;


export default function MemberDisplay (props: ComponentProps<'section'> & { member: ProjectMember }): ReactElement {
    return (
        <Card>
            <CardPadding>
                <CardHeader>
                    {
                        // Displays the user's avatar
                        props.member.userState.avatar && (
                            <UserAvatarStatus
                                animate={props.member.userState.status !== "offline"}
                                statusColor={statusToColor(props.member.userState.status)}
                                avatar={getAvatar(props.member)}
                            />
                        )
                    }
                    <UserCardName>
                        <LogosInline>
                            <h3 style={{marginTop: "0.5em"}}>{props.member.username}</h3>
                            <p style={{marginLeft: "0.3em"}}>#{props.member.userState.discriminator}</p>
                        </LogosInline>

                        <LogosInline as={ButtonGroup} buttonPadding="0.3rem">

                        </LogosInline>
                    </UserCardName>
                </CardHeader>

                <CardSection style={{textAlign: "center"}}>
                    {props.member.description || "No description provided."}
                </CardSection>
            </CardPadding>
        </Card>
    );
}
