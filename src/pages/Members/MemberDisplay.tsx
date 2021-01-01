import React, { ComponentProps, ReactElement } from "react";
import { Card, CardPadding } from "components/ui/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus";
import { getAvatar, statusToColor } from "../../utilities";
import { CachedUser } from "./Members";
import styled from "styled-components";
import ButtonGroup from "components/ui/ButtonGroup";
import { Button } from "components/ui/Button";
import { AiFillGithub } from "react-icons/all";

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
    color: ${(properties) => properties.color};
`;

const Emote = styled.img`
    height: 32px;
    display: inline-block;
    transform: translateY(8px);
`;

const Image = styled.div`
  min-width: 7rem;
  height: 7rem;
`;

/**
 * @param props
 * @param properties
 */
function MemberDisplay(
  properties: ComponentProps<"section"> & { member: CachedUser }
): ReactElement {
  return (
    <Card className={properties.className}>
      <CardPadding>
        <CardHeader>
          <Image>
            <UserAvatarStatus
              animate={properties.member.presence?.status !== "offline"}
              statusColor={statusToColor(
                properties.member.presence?.status || "offline"
              )}
              avatar={getAvatar(properties.member)}
            />
          </Image>
          <div>
            <h2>
              {properties.member.username}{" "}
              <sub>#{properties.member.discriminator}</sub>
            </h2>
            <RoleLabel color={properties.member.hoistRole.color}>
              {properties.member.hoistRole.name}
            </RoleLabel>
            <div>
              {properties.member.presence?.presenceText && (
                <p>
                  {properties.member.presence?.emote &&
                    (properties.member.presence.emote.startsWith("http") ? (
                      <Emote src={properties.member.presence.emote} />
                    ) : (
                      properties.member.presence.emote
                    ))}
                  {"   " + properties.member.presence?.presenceText}
                </p>
              )}
            </div>
          </div>

          <ButtonGroup style={{ gridColumn: "1 / 3" }}>
            <Button>
              <AiFillGithub size={20} />
            </Button>
            <Button>
              <AiFillGithub size={20} />
            </Button>
            <Button>
              <AiFillGithub size={20} />
            </Button>
          </ButtonGroup>
        </CardHeader>

        <CardPadding>{"No description for now."}</CardPadding>
      </CardPadding>
    </Card>
  );
}

export default MemberDisplay;
