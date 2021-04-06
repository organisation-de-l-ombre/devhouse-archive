import React, { AllHTMLAttributes, DetailedHTMLProps, FC } from "react";
import UserAvatarStatus from "components/ui/UserAvatarStatus/UserAvatarStatus";
import {
  StaffMember,
  StaffMemberSocialsIconEnum,
} from "@developers-house/abdera";
import Button, { ButtonImage } from "components/ui/Button/Button";
import { FaGithub, FaGitlab, FaStackOverflow, GiClick } from "react-icons/all";
import { FaDiscord } from "react-icons/fa";
import { IconType } from "react-icons";
import { getAvatar, statusToColor } from "../../utilities";
import styles from "./member.module.scss";
import Tooltip from "../../components/tooltip/Tooltip";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";

const socialIcons: { icon: IconType; name: StaffMemberSocialsIconEnum }[] = [
  { icon: FaStackOverflow, name: StaffMemberSocialsIconEnum.Stackoverflow },
  { icon: FaDiscord, name: StaffMemberSocialsIconEnum.Discord },
  { icon: FaGithub, name: StaffMemberSocialsIconEnum.Github },
  { icon: FaGitlab, name: StaffMemberSocialsIconEnum.Gitlab },
  { icon: GiClick, name: StaffMemberSocialsIconEnum.Website },
];

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
                {member.presence.text}
              </p>
            )}
          </div>
        </Tooltip>
      </div>
      <p className={styles.text} />

      <ButtonGroup>
        {member.socials &&
          member.socials
            .map((icon) => {
              const { icon: IconComponent } = socialIcons.filter(
                (other) => other.name === icon.icon
              )[0] || {
                icon: null,
              };
              return (
                <a
                  key={icon.name}
                  referrerPolicy="no-referrer"
                  target="_blank"
                  href={icon.link}
                  rel="noreferrer"
                >
                  <Button>
                    {IconComponent && (
                      <ButtonImage>
                        <IconComponent />
                      </ButtonImage>
                    )}
                    {icon.name}
                  </Button>
                </a>
              );
            })
            .filter(Boolean)}
      </ButtonGroup>
    </div>
  );
};

export default MemberDisplay;
