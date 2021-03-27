import React, { FC, DetailedHTMLProps, AllHTMLAttributes } from "react";
import { Card, CardPadding } from "components/ui/Card/Card";
import UserAvatarStatus from "components/ui/UserAvatarStatus/UserAvatarStatus";
import { getAvatar, statusToColor } from "../../utilities";
import styles from "./member.module.scss";
import Tooltip from "../../components/tooltip/Tooltip";
import { StaffMember } from "../../api/gen";

const MemberDisplay: FC<
  DetailedHTMLProps<AllHTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    member: StaffMember;
  }
> = ({ className, member }) => {
  return (
    <Card className={className}>
      <CardPadding>
        <div className={styles.header}>
          <div className={styles.svgContainer}>
            <UserAvatarStatus
              height="7rem"
              animate={member.presence.status !== "offline"}
              statusColor={statusToColor(member.presence.status || "offline")}
              avatar={getAvatar(member)}
            />
          </div>
          <div>
            <Tooltip tooltip={`${member.username}#${member.discriminator}`}>
              <h2>{member.username}</h2>
            </Tooltip>
            <p style={{ color: member.role.color }}>{member.role.name}</p>
            <div>
              {member.presence.text && (
                <p>
                  {member.presence.emote &&
                    (member.presence.emote.startsWith("http") ? (
                      <img
                        alt="Discord emoji"
                        className={styles.emote}
                        src={member.presence.emote}
                      />
                    ) : (
                      member.presence.emote
                    ))}
                  {`   ${member.presence.text}`}
                </p>
              )}
            </div>
          </div>
        </div>
        <CardPadding>No description for now.</CardPadding>
      </CardPadding>
    </Card>
  );
};

export default MemberDisplay;
