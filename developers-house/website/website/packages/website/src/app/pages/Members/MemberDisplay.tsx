import React, {ReactElement} from "react";
/*
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
*/

export default function MemberDisplay (
): ReactElement {
    /*
    const {user, description, gitlab, github, website} = props.member;
    const {avatar, presence, username, discriminator} = user;

    return (
        <Card>
            <CardPadding>
                <CardHeader>
                    {
                        // Displays the user's avatar
                        avatar && (
                            <UserAvatarStatus
                                animate={presence?.status !== "offline"}
                                statusColor={statusToColor(presence?.status)}
                                avatar={getAvatar(props.member)}
                            />
                        )
                    }
                    <UserCardName>
                        <LogosInline>
                            <h3 style={{marginTop: "0.5em"}}>{username}</h3>
                            <p style={{marginLeft: "0.3em"}}>#{discriminator}</p>
                        </LogosInline>

                        <LogosInline as={ButtonGroup} buttonPadding="0.3rem">
                            {github && (
                                <Button as="a" href={github}>
                                    <ButtonImage>
                                        <AiFillGithub/>
                                    </ButtonImage>
                                </Button>
                            )}
                            {gitlab && (
                                <Button as="a" href={gitlab}>
                                    <ButtonImage>
                                        <AiFillGitlab/>
                                    </ButtonImage>
                                </Button>
                            )}
                            {website && (
                                <Button as="a" href={website}>
                                    <ButtonImage>
                                        <RiWindowLine/>
                                    </ButtonImage>
                                </Button>
                            )}
                        </LogosInline>
                    </UserCardName>
                </CardHeader>

                <CardSection style={{textAlign: "center"}}>
                    {description || "No description provided."}
                </CardSection>
            </CardPadding>
        </Card>
    );*/
    return (<></>);
}
