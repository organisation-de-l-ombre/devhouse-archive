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
    grid-gap: 25px;
    width: 100%;
    align-items: center;
    div h2, p {
        word-break: break-all;
    }
`;

function MemberDisplay(props: ComponentProps<'section'> & { member: CachedUser }): ReactElement {
    return (
        <Card className={props.className}>
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
                    <div>
                        <h2>
                            {props.member.nickname || props.member.username}
                        </h2>
                        <p>
                            {props.member.hoistRole}
                        </p>
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

                <CardSection>
                    {'No description for now.'.repeat(10)}
                </CardSection>
            </CardPadding>
        </Card>
    );
}

export default styled(MemberDisplay)`
    flex: 1 auto;
    width: calc(33% - 20px);
`;
