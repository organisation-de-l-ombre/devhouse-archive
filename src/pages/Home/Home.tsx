import React, { ReactElement, useCallback, useMemo } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiPencilRuler2Line } from "react-icons/ri";
import Button, { ButtonImage } from "components/ui/Button/Button";
import ButtonGroup from "components/ui/Button/ButtonGroup";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsPeople } from "react-icons/all";
import styles from "./Home.module.scss";

const shareAvailable = !!navigator.share;
const protocolAvailable = !!navigator.registerProtocolHandler;

export default function HomePage(): ReactElement {
  const theme = useSelector((s) => s.theme.theme);
  const imageURL = useMemo(
    // eslint-disable-next-line import/no-dynamic-require,global-require
    () => require(`../../assets/${theme}/header-waves.svg`),
    [theme]
  );
  const share = useCallback(() => {
    navigator.share({
      title: "Developer's House",
      text: "Discover Developer's House today!",
      url: document.location.toString(),
    });
  }, []);

  const protocol = useCallback(() => {
    const url = `${document.location.toString()}?url=%s`;
    navigator.registerProtocolHandler("web+devhouse", url, "Developer's House");
  }, []);

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${imageURL})`,
        }}
        className={`${styles.headerContent} ${styles.homeHeader}`}
      >
        <h1 className={styles.headerTitle}>Developer&rsquo;s House</h1>
        <p className={styles.headerSubtext}>
          We are a small team of developers who seek to learn with a team of
          people, our goal is to learn how to work as a team.
        </p>
        <ButtonGroup full className={styles.margin}>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/r8RC2TjnFd"
          >
            <Button large>
              <ButtonImage>
                <FaDiscord />
              </ButtonImage>
              Discord server
            </Button>
          </a>
          <NavLink to="/projects">
            <Button large>
              <ButtonImage>
                <RiPencilRuler2Line />
              </ButtonImage>
              View projects
            </Button>
          </NavLink>
          <NavLink to="/members">
            <Button large>
              <ButtonImage>
                <BsPeople />
              </ButtonImage>
              View members
            </Button>
          </NavLink>
        </ButtonGroup>
      </div>
      <section className={styles.points}>
        <div>
          <h2>Who are we ?</h2>
          <p>
            We are a group of students who are passioned about technology and
            software engineering who aims to build projects together; As a team
            in order to learn how to use tools to work efficiently and as a
            team.
          </p>
          <NavLink to="/about">
            <Button>More about us</Button>
          </NavLink>
        </div>
        <div>
          <h2>What projects do we have ?</h2>
          <p>
            Our team regroups many projects including many platforms such as
            android, ios and the web. Our projects ideas come from the
            team&rsquo;s members who want to include their projects in the team.
            The project, even if it&rsquo;s a Developer&rsquo;s House project
            stay in the total control of it&rsquo;s owner.
          </p>
          <NavLink to="/projects">
            <Button>More projects.</Button>
          </NavLink>
        </div>

        <div>
          <h2>What technologies do we use ?</h2>
          <p>
            Our current technological stack is based around
            JavaScript/TypeScript, GoLang, Docker and Kubernetes. We use a lot
            of open-source technologies and aim to contribute to the open-source
            world in the future. We use GitLab as a source code management
            service.
          </p>
        </div>

        <div>
          <h2>Who is part of the project ?</h2>
          <p>
            Anyone can take part of the project as long as you have some basic
            understanding of programming and computer science in general. We do
            not search someone who know everything and brag about it, we search
            people that want to contribute and help others to learn.
          </p>
          <NavLink to="/members">
            <Button>View the project&rsquo;s members</Button>
          </NavLink>
        </div>
      </section>

      <span className={styles.background}>
        <div className={styles.content}>
          <h2>Join us today!</h2>
          <p>
            In order to enter our team, you must complete the following
            application form; We do not have any requirements except a basic
            understanding of how a computer works. See you soon!
          </p>
          <NavLink to="/join">
            <Button>Fill the application form</Button>
          </NavLink>
        </div>
      </span>
      <section className={styles.contact}>
        <h2>Stay in contact with the project!</h2>
        <p>
          You can stay in the contact and chat with us by joining our public
          discord server!
        </p>
        <ButtonGroup>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/r8RC2TjnFd"
          >
            <Button>Join our discord server</Button>
          </a>
          {shareAvailable && <Button onClick={share}>Share the project</Button>}
          {protocolAvailable && (
            <Button onClick={protocol}>Add the protocol</Button>
          )}
        </ButtonGroup>
      </section>
      <section className={styles.contact}>
        <h2>Contact information</h2>
        <p>
          If you need any information about this website or the organization
          behind it, feel free to contact us, we will respond as soon as we can!
        </p>
        <ButtonGroup>
          <a href="mailto:matthieu@developershouse.xyz">
            <Button>By email</Button>
          </a>
          <NavLink to="/contact">
            <Button>Contact us</Button>
          </NavLink>
        </ButtonGroup>
      </section>
    </div>
  );
}
