import { Card } from "components/ui/Card";
import React, { ReactElement } from "react";
import ScrollAnimation from "react-animate-on-scroll";
import rootStyles from "../../Root.module.scss";
import projects from "./projects.temp.json";

export default function ProjectsPage(): ReactElement {
  return (
    <div className={[rootStyles.container, rootStyles.flexColumn].join(" ")}>
      {projects.map((project) => {
        return (
          <ScrollAnimation animateIn="fadeIn" key={project.name}>
            <Card>
              <h1>{project.name}</h1>
              <p>{project.description}</p>
            </Card>
          </ScrollAnimation>
        );
      })}
    </div>
  );
}
