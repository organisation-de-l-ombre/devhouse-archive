import React, { FC, DetailedHTMLProps, AllHTMLAttributes } from "react";
import UserAvatarStatus from "components/ui/UserAvatarStatus/UserAvatarStatus";
import { StaffMember } from "@developers-house/abdera";
import Button from "components/ui/Button/Button";
import { getAvatar, statusToColor } from "../../utilities";
import styles from "./member.module.scss";
import Tooltip from "../../components/tooltip/Tooltip";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";

const MemberDisplay: FC<
  DetailedHTMLProps<AllHTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    member: StaffMember;
  }
> = ({ className, member }) => {
  return (
    <div className={className}>
      <div className={styles.header}>
        <div className={styles.svgContainer}>
          <UserAvatarStatus
            height="7rem"
            animate={member.presence.status !== "offline"}
            statusColor={statusToColor(member.presence.status || "offline")}
            avatar={getAvatar(member)}
          />
        </div>
        <Tooltip
          className={styles.name}
          showMobile
          tooltip={`${member.username}#${member.discriminator}`}
        >
          <h2>{member.username}</h2>
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
        </Tooltip>
      </div>
      <p className={styles.text}>{"a".repeat(5)}</p>

      <ButtonGroup>
        <Button>View profile</Button>
      </ButtonGroup>
    </div>
  );
};

export default MemberDisplay;
