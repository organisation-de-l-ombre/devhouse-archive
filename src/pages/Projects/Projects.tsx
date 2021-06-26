import { Card } from "@components/new/Card/Card";
import React, { CSSProperties, ReactElement } from "react";
import { Button, NavLinkButton } from "@components/new/Button/Button";
import Tooltip from "rc-tooltip";
import ButtonGroup from "@components/new/Button/ButtonGroup";
import useProjects from "@hooks/useProjects";
import { Loader } from "@components/SuspenseLoader/SuspenseLoader";
import UserAvatarStatus from "@components/UserAvatarStatus/UserAvatarStatus";
import { getAvatar, statusToColor } from "@utilities/index";
import { withNetwork } from "@hooks/hoc/withNetwork";
import { Flex } from "@components/new/Flex/FlexContainer";
import { Stack } from "@components/new/Stack/Stack";
import { Header } from "@components/Header";
import { withGate } from "@components/FeatureGate/FeatureGateProvider";
import { Metadata } from "@components/Meta/Metadata";
import styles from "./Projects.module.scss";

const ProjectsPage = (): ReactElement => {
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
    return <Header>{error.message}</Header>;
  }

  return (
    <div className={styles.main}>
      <Metadata
        title="Projects | Developer's House"
        description="We are much more than you think! That is why this webpage exist on
            the website. Here are displayed each projects of our team. You can
            found all information you need."
      />
      <Stack>
        <Header>
          <h1>About our projects</h1>
          <p>
            We are much more than you think! That is why this webpage exist on
            the website. Here are displayed each projects of our team. You can
            found all information you need.
          </p>
        </Header>
        <Flex flexDirection="row" flexWrap>
          {data
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((project) => {
              return (
                <Card
                  className={styles.panel}
                  key={project.name}
                  style={
                    { "--image": `url("${project.logo}")` } as CSSProperties
                  }
                >
                  <h2>{project.name}</h2>
                  <div className={styles.text}>
                    <p className={styles.full}>{project.shortDescription}</p>
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
                                    This member is a member on this project{" "}
                                    <br />
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
                  <ButtonGroup className={styles["buttons-group"]}>
                    <NavLinkButton to={`/projects/${project.normalizedName}`}>
                      More information
                    </NavLinkButton>
                    <Button>Visit the project</Button>
                  </ButtonGroup>
                </Card>
              );
            })}
        </Flex>
      </Stack>
    </div>
  );
};

export default withGate(withNetwork(ProjectsPage), "feature_projects");
