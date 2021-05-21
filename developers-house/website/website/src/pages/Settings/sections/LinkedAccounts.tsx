import React, { FC, ReactElement } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { RiGitlabFill } from "react-icons/ri";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Link } from "@developers-house/abdera";
import useLinkedAccounts from "../../../hooks/useLinkedAccounts";
import { TitleBox } from "../../../components/TitleBox/TitleBox";
import { Loader } from "../../../components/SuspenseLoader/SuspenseLoader";
import { Card } from "../../../components/Card/Card";
import styles from "../settings.module.scss";
import { Button } from "../../../components/Button/Button";

const DisplayPlatformSVG: FC<{ platform: string }> = ({ platform }) => {
  switch (platform) {
    case "discord":
      return <FaDiscord />;

    case "github":
      return <FaGithub />;

    case "gitlab":
      return <RiGitlabFill />;

    default:
      return <BsQuestionCircleFill />;
  }
};

const platforms = {
  discord: "Discord",
  github: "GitHub",
  gitlab: "GitLab",
};
const getPlatformName = (platform: keyof typeof platforms): string => {
  if (!platforms[platform]) {
    return platform;
  }

  return platforms[platform];
};

const LinkedAccounts: FC = () => {
  const { isLoading, error, data } = useLinkedAccounts();

  if (error) {
    return (
      <TitleBox>
        <p>
          {error.name}: {error.message} <br /> {error.stack}
        </p>
      </TitleBox>
    );
  }
  if (!data || isLoading) {
    return (
      <TitleBox>
        <Loader />
      </TitleBox>
    );
  }

  return (
    <div className={styles.links}>
      {data.map(
        (link: Link): ReactElement => {
          return (
            <Card key={link.platformId} className={styles.link}>
              <div className={styles.title}>
                <DisplayPlatformSVG platform={link.platform} />
                <span>
                  {getPlatformName(link.platform as keyof typeof platforms)}
                </span>
              </div>
              <Button>Remove link</Button>
            </Card>
          );
        }
      )}
    </div>
  );
};

export default LinkedAccounts;
