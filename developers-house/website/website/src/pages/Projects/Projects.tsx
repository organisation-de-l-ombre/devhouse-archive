import { Card } from "components/ui/Card/Card";
import React, { CSSProperties, ReactElement } from "react";
import Text from "components/ui/Text/Text";
import Button from "components/ui/Button/Button";
import Tooltip from "rc-tooltip";
import { TitleBox } from "../../components/ui/TitleBox/TitleBox";
import styles from "./Projects.module.scss";
import ButtonGroup from "../../components/ui/Button/ButtonGroup";
import useProjects from "../../hooks/useProjects";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";
import UserAvatarStatus from "../../components/ui/UserAvatarStatus/UserAvatarStatus";
import { getAvatar, statusToColor } from "../../utilities";
import { withNetwork } from "../../hooks/hoc/withNetwork";

function ProjectsPage(): ReactElement {
  const { data, isLoading, error } = useProjects({
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading || !data) {
    return <Loader />;
  }

  if (error) {
    return <TitleBox>{error.message}</TitleBox>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.grid}>
        <TitleBox className={styles.header}>
          <h1>About our projects</h1>
          <Text className={styles["top-text-margin"]}>
            We are much more than you think! That is why this webpage exist on
            the website. Here are displayed each projects of our team. You can
            found all information you need.
          </Text>
        </TitleBox>
        {data
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((project) => {
            return (
              <Card
                className={styles.panel}
                key={project.name}
                style={{ "--image": `url("${project.logo}")` } as CSSProperties}
              >
                <h2>{project.name}</h2>
                <div className={styles.text}>
                  <p className={styles.full}>{project.longDescription}</p>
                  <div className={styles.users}>
                    <div className={styles.managers}>
                      {project.managers.map((member) => {
                        return (
                          <Tooltip
                            key={member.id}
                            overlay={
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <p style={{ margin: "0" }}>
                                  <b style={{ marginBottom: "0.125rem" }}>
                                    {member.username}
                                  </b>
                                  <br />
                                  This member is a manager on this project{" "}
                                  <br />
                                  and a <b>{member.role.name}</b> on
                                  Developer&rsquo;s House
                                </p>
                              </div>
                            }
                          >
                            <UserAvatarStatus
                              statusColor={statusToColor(
                                member.presence.status
                              )}
                              avatar={getAvatar(member)}
                            />
                          </Tooltip>
                        );
                      })}
                    </div>
                    <div className={styles.members}>
                      {project.members?.map((member) => {
                        return (
                          <Tooltip
                            placement="top"
                            overlay={
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <p style={{ margin: "0" }}>
                                  <b style={{ marginBottom: "0.125rem" }}>
                                    {member.username}
                                  </b>
                                  <br />
                                  This member is a member on this project <br />
                                  and a <b>{member.role.name}</b> on
                                  Developer&rsquo;s House
                                </p>
                              </div>
                            }
                            key={member.id}
                          >
                            <UserAvatarStatus
                              statusColor={statusToColor(
                                member.presence.status
                              )}
                              avatar={getAvatar(member)}
                            />
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <ButtonGroup>
                  <Button margin>More information</Button>
                  <Button margin>Visit the project</Button>
                </ButtonGroup>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default withNetwork(ProjectsPage);
