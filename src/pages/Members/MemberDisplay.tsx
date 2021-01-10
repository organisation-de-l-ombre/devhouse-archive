import React, { ComponentProps, ReactElement } from "react";
import { Card, CardPadding } from "components/ui/Card/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus/UserAvatarStatus";
import { getAvatar, statusToColor } from "../../utilities";
import { CachedUser } from "./types";
import styles from "./member.module.scss";
import Tooltip from "../../components/tooltip/Tooltip";

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
        <div className={styles.header}>
          <div className={styles.svgContainer}>
            <UserAvatarStatus
              height="7rem"
              animate={member.presence?.status !== "offline"}
              statusColor={statusToColor(member.presence?.status || "offline")}
              avatar={getAvatar(member)}
            />
          </div>
          <div>
            <Tooltip tooltip={`${username}#${discriminator}`}>
              <h2>{username}</h2>
            </Tooltip>
            <p style={{ color }}>{name}</p>
            <div>
              {presence?.presenceText && (
                <p>
                  {presence?.emote &&
                    (presence.emote.startsWith("http") ? (
                      <img
                        alt="Discord emoji"
                        className={styles.emote}
                        src={presence.emote}
                      />
                    ) : (
                      presence.emote
                    ))}
                  {`   ${presence?.presenceText}`}
                </p>
              )}
            </div>
          </div>
        </div>
        <CardPadding>No description for now.</CardPadding>
      </CardPadding>
    </Card>
  );
}

export default MemberDisplay;
