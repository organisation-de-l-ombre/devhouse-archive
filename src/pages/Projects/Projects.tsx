import { Card, CardFlexContainer, CardPadding } from "components/ui/Card/Card";
import React, { ReactElement } from "react";
import Text from "components/ui/Text/Text";
import ButtonGroup from "components/ui/Button/ButtonGroup";
import Button from "components/ui/Button/Button";
import projects from "./projects.temp.json";
import { TitleBox } from "../../components/ui/TitleBox/TitleBox";
import styles from "./Projects.module.scss";

export default function ProjectsPage(): ReactElement {
  return (
    <div className={styles.main}>
      <TitleBox>
        <h1>About our projects</h1>
        <Text className={styles["top-text-margin"]}>
          We are much more than you think! That is why this webpage exist on the
          website. Here are displayed each projects of our team. You can found
          all information you need.
        </Text>
      </TitleBox>
      <CardFlexContainer className={styles["projects-container"]}>
        {projects
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((project) => {
            return (
              <Card className={styles["card-container"]} key={project.name}>
                <CardPadding>
                  <h2>{project.name}</h2>
                  <hr />
                  <Text className={styles.text}>{project.description}</Text>

                  <div className={styles["members-global-container"]}>
                    <div className={styles["members-container"]}>
                      <h3 className={styles["h3-margin"]}>
                        Project manager
                        {project.managers.length > 1 ? "s" : ""}
                      </h3>
                      <ButtonGroup>
                        {project.managers
                          .sort((a, b) => a.localeCompare(b))
                          .map((member) => {
                            return <Button key={member}>{member}</Button>;
                          })}
                      </ButtonGroup>
                    </div>
                    <div className={styles["members-container"]}>
                      <h3 className={styles["h3-margin"]}>
                        Project member
                        {project.members.length > 1 ? "s" : ""}
                      </h3>
                      <ButtonGroup>
                        {project.members
                          .sort((a, b) => a.localeCompare(b))
                          .map((member) => {
                            return <Button key={member}>{member}</Button>;
                          })}
                      </ButtonGroup>
                    </div>
                  </div>
                </CardPadding>
              </Card>
            );
          })}
      </CardFlexContainer>
    </div>
  );
}
