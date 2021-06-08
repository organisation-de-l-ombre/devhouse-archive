import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { RouteComponentProps, useHistory } from "react-router";
import useProjects from "hooks/useProjects";
import { Projects, StaffMember } from "@developers-house/abdera";
import CenteredMessage from "components/CenteredMessage/CenteredMessage";
import Button from "components/Button/Button";
import FlexContainer from "components/FlexContainer/FlexContainer";
import ReactMarkdown from "react-markdown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import rehypeHighlight from "rehype-highlight";
import { BsArrowLeft } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import styles from "./ProjectDetails.module.scss";
import globalStyles from "../../styles/Global.module.scss";
import { Loader } from "../../components/SuspenseLoader/SuspenseLoader";
import { TitleBox } from "../../components/TitleBox/TitleBox";
import { Card, CardPadding } from "../../components/Card/Card";
import UserAvatarStatus from "../../components/UserAvatarStatus/UserAvatarStatus";
import { getAvatar, statusToColor } from "../../utilities";
import { discordServer } from "../../constants";

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
  const [markdown, setMarkdown] = useState<string | undefined>(undefined);
  const fetchMarkdown = useCallback(async (url: string): Promise<
    string | undefined
  > => {
    const request = await fetch(url);

    if (request.status !== 200) {
      return undefined;
    }

    return request.text();
  }, []);

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

    const projectData: Projects = projectsFilter[0];

    setProject(projectData);

    if (projectData.markdownS3) {
      fetchMarkdown(projectData.markdownS3).then(
        (response: string | undefined): void => {
          if (response !== undefined) {
            setMarkdown(response);
          }
        }
      );
    }
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
        <BackToProjects />
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
      <BackToProjects />
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
      {["managers", "members"].map((category): ReactElement => {
        return (
          <div key={category} className={styles.section}>
            <h2>Project {category}</h2>
            <div className={styles.cards}>
              {project[category as Category]?.map(
                (member: StaffMember): ReactElement => {
                  return (
                    <Card key={member.id} className={styles["card-root"]}>
                      <CardPadding className={styles["card-content"]}>
                        <UserAvatarStatus
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
                      </CardPadding>
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
        {markdown ? (
          <div className={styles.markdown}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <p>
            It seems {project.name} does not have any detailed information. If
            you think it is a bug try to refresh this page. In any case it is
            always possible to get additional information on this project by
            joining our{" "}
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

export default ProjectDetails;
