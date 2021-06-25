import React, { FC, ReactElement } from "react";
import { RouteComponentProps } from "react-router";
import { useProjectsWithMarkdown } from "@hooks/useProjects";
import { StaffMember } from "@developers-house/abdera";
import FlexContainer from "@components/FlexContainer/FlexContainer";
import ReactMarkdown from "react-markdown";
import { BsArrowLeft } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import globalStyles from "@styles/Global.module.scss";
import { Loader } from "@components/SuspenseLoader/SuspenseLoader";
import { Card } from "@components/new/Card/Card";
import UserAvatarStatus from "@components/UserAvatarStatus/UserAvatarStatus";
import { getAvatar, statusToColor } from "@utilities/index";
import { Header } from "@components/Header";
import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import { discordServer } from "../../constants";
import styles from "./ProjectDetails.module.scss";

type Category = "managers" | "members";

const BackToProjects = (): ReactElement => {
  return (
    <NavLink to="/projects" className={styles["back-to-projects"]}>
      <div>
        <BsArrowLeft />
      </div>
      <span>Back to projects</span>
    </NavLink>
  );
};

const ProjectDetails: FC<RouteComponentProps> = ({ match }) => {
  const projectId = (match.params as Record<string, unknown>).id as string;
  const { data, isLoading, error } = useProjectsWithMarkdown(projectId, {
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Header>{error.message}</Header>;
  }

  if (!data) {
    return <></>;
  }

  return (
    <FlexContainer className={styles.container}>
      <BackToProjects />
      <div className={styles.headers}>
        {data.logo && (
          <img src={data.logo} alt={`${data.name} icon`} draggable={false} />
        )}
        <h1>{data.name}</h1>
      </div>
      <p className={styles.description}>
        <q className={globalStyles.quotes}>{data.longDescription}</q>
      </p>
      {["managers", "members"].map((category): ReactElement => {
        return (
          <div key={category} className={styles.section}>
            <h2>Project {category}</h2>
            <div className={styles.cards}>
              {data[category as Category]?.map(
                (member: StaffMember): ReactElement => {
                  return (
                    <Card key={member.id} className={styles["card-root"]}>
                      <UserAvatarStatus
                        css={{ width: "25%" }}
                        statusColor={statusToColor(member.presence.status)}
                        avatar={getAvatar(member)}
                      />
                      <div className={styles.content}>
                        <h2>{member.username}</h2>
                        <h3 style={{ color: member.role.color }}>
                          {member.role.name}
                        </h3>
                        <div>
                          {member.presence.text && (
                            <p>
                              {member.presence.emote &&
                                (member.presence.emote.startsWith("http") ? (
                                  <img
                                    alt="Discord emoji"
                                    src={member.presence.emote}
                                  />
                                ) : (
                                  member.presence.emote
                                ))}
                              {member.presence.text}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                }
              )}
            </div>
          </div>
        );
      })}
      <div className={styles.section}>
        <h2>Detailed project information</h2>
        {data.markdown ? (
          <div className={styles.markdown}>
            <ReactMarkdown>{data.markdown}</ReactMarkdown>
          </div>
        ) : (
          <p>
            It seems {data.name} does not have any detailed information. If you
            think it is a bug try to refresh this page. In any case it is always
            possible to get additional information on this project by joining
            our{" "}
            <a href={discordServer} target="blank">
              Discord server
            </a>
            .
          </p>
        )}
      </div>
    </FlexContainer>
  );
};

export default withGate(ProjectDetails, "feature_projects");
