import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import useProjects from "hooks/useProjects";
import { Projects } from "@developers-house/abdera";
import CenteredMessage from "components/CenteredMessage/CenteredMessage";
import Button from "components/ui/Button/Button";
import FlexContainer from "components/FlexContainer/FlexContainer";
import styles from "./ProjectDetails.module.scss";
import globalStyles from "../../styles/Global.module.scss";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";
import { TitleBox } from "../../components/ui/TitleBox/TitleBox";

const ProjectDetails: FC<RouteComponentProps> = ({ match }) => {
  const { data, isLoading, error } = useProjects({
    refetchOnMount: false,
    refetchIntervalInBackground: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [project, setProject] = useState<Projects | undefined>(undefined);
  const projectID = (match.params as Record<string, unknown>).id as string;
  const history = useHistory();

  useEffect((): void => {
    if (!data) {
      return;
    }

    const projectsFilter: Projects[] = data.filter(
      (element: Projects): boolean => element.normalizedName === projectID
    );

    if (!projectsFilter.length) {
      return;
    }

    setProject(projectsFilter[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <TitleBox>{error.message}</TitleBox>;
  }

  if (!project) {
    return (
      <CenteredMessage title="Project not found">
        <p>
          It seems this project doesn not exist. If you are here, it is
          certainly a mistake...
        </p>
        <Button onClick={() => history.push("/projects")}>
          Return to projects
        </Button>
      </CenteredMessage>
    );
  }

  return (
    <FlexContainer className={styles.container}>
      <div className={styles.headers}>
        {project.logo && (
          <img
            src={project.logo}
            alt={`${project.name} icon`}
            draggable={false}
          />
        )}
        <h1>{project.name}</h1>
      </div>
      <p className={styles.description}>
        <q className={globalStyles.quotes}>{project.longDescription}</q>
      </p>
    </FlexContainer>
  );
};

export default ProjectDetails;
