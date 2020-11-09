import React, {ComponentProps, ReactElement} from "react";
import styled from "styled-components";
import {Card, CardHeader, CardPadding, CardSection} from "components/ui/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus";
import {getAvatar, statusToColor} from "../../utilities";
import ButtonGroup from "../../components/ui/ButtonGroup";
import {CachedUser} from "./Members";

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


export default function MemberDisplay(props: ComponentProps<'section'> & { member: CachedUser }): ReactElement {
    return (
        <Card>
            <CardPadding>
                <CardHeader>
                    {
                        // Displays the user's avatar
                        props.member.avatar && (
                            <UserAvatarStatus
                                animate={props.member.presence.status !== "offline"}
                                statusColor={statusToColor(props.member.presence.status)}
                                avatar={getAvatar(props.member)}
                            />
                        )
                    }
                    <UserCardName>
                        <LogosInline>
                            <h3 style={{marginTop: "0.5em"}}>{props.member.username}</h3>
                            <p style={{marginLeft: "0.3em"}}>#{props.member.id}</p>
                        </LogosInline>

                        <LogosInline as={ButtonGroup} buttonPadding="0.3rem">

                        </LogosInline>
                    </UserCardName>
                </CardHeader>

                <CardSection style={{textAlign: "center"}}>
                    {"No description provided."}
                </CardSection>
            </CardPadding>
        </Card>
    );
}
