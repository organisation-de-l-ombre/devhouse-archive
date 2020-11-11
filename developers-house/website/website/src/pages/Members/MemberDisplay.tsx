import React, {ComponentProps, ReactElement} from "react";
import {Card, CardPadding, CardSection} from "components/ui/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus";
import {getAvatar, statusToColor} from "../../utilities";
import {CachedUser} from "./Members";
import styled from "styled-components";
import ButtonGroup from "components/ui/ButtonGroup";
import {Button} from "components/ui/Button";
import {AiFillGithub} from "react-icons/all";

const CardHeader = styled.div`
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-template-rows: 1fr auto;
    grid-gap: 10px;
    width: 100%;
    align-items: center;
    div h2, p {
        word-break: break-word;
    }
`;

const RoleLabel = styled.p`
    color: ${(props) => props.color};
`;

const Emote = styled.img`
    height: 32px;
    display: inline-block;
    transform: translateY(8px);
`;

function MemberDisplay(props: ComponentProps<'section'> & { member: CachedUser }): ReactElement {
    return (
        <Card className={props.className} style={{ flex: `${Math.floor(Math.random() * 50 + 1)} 33%` }}>
            <CardPadding>
                <CardHeader>
                        {
                            // Displays the user's avatar
                            (
                                <UserAvatarStatus
                                    animate={props.member.presence?.status !== "offline"}
                                    statusColor={statusToColor(props.member.presence?.status || 'offline')}
                                    avatar={getAvatar(props.member)}
                                />
                            )
                        }
                    <div>
                        <h2>
                            {props.member.nickname || props.member.username} <sub>#{ props.member.discriminator }</sub>
                        </h2>
                        <RoleLabel color={props.member.hoistRole.color}>
                            {props.member.hoistRole.name}
                        </RoleLabel>
                        <div>
                            {
                                props.member.presence?.presenceText && <p>
                                    {
                                        props.member.presence?.emote && (
                                            props.member.presence.emote.startsWith('http') ?
                                                <Emote src={props.member.presence.emote}/> : props.member.presence.emote
                                        )
                                    }
                                    { '   ' + props.member.presence?.presenceText }
                                </p>
                            }
                        </div>


                    </div>

                    <ButtonGroup style={{ gridColumn: '1 / 3' }}>
                        <Button>
                            <AiFillGithub size={20}/>
                        </Button>
                        <Button>
                            <AiFillGithub size={20}/>
                        </Button>
                        <Button>
                            <AiFillGithub size={20}/>
                        </Button>
                    </ButtonGroup>
                </CardHeader>

                <CardPadding>
                    {'No description for now.'}
                </CardPadding>
            </CardPadding>
        </Card>
    );
}

export default MemberDisplay;
