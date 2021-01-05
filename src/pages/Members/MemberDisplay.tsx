import React, { ComponentProps, ReactElement } from "react";
import { Card, CardPadding } from "components/ui/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus";
import styled from "styled-components";
import { CachedUser } from "./Members";
import { getAvatar, statusToColor } from "../../utilities";

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr auto;
  grid-gap: 10px;
  width: 100%;
  align-items: center;
  div h2,
  p {
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

const Image = styled.div`
  min-width: 7rem;
  height: 7rem;
`;

function MemberDisplay({
  className,
  member: {
    presence,
    discriminator,
    username,
    hoistRole: { name, color },
  },
  member,
}: ComponentProps<"section"> & { member: CachedUser }): ReactElement {
  return (
    <Card className={className}>
      <CardPadding>
        <CardHeader>
          <Image>
            <UserAvatarStatus
              animate={member.presence?.status !== "offline"}
              statusColor={statusToColor(member.presence?.status || "offline")}
              avatar={getAvatar(member)}
            />
          </Image>
          <div>
            <h2>
              {username} <sub>#{discriminator}</sub>
            </h2>
            <RoleLabel color={color}>{name}</RoleLabel>
            <div>
              {presence?.presenceText && (
                <p>
                  {presence?.emote &&
                    (presence.emote.startsWith("http") ? (
                      <Emote src={presence.emote} />
                    ) : (
                      presence.emote
                    ))}
                  {`   ${presence?.presenceText}`}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <hr />
        <CardPadding>No description for now.</CardPadding>
      </CardPadding>
    </Card>
  );
}

export default MemberDisplay;
