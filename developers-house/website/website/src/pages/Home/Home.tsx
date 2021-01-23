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
          <h2>Who we are</h2>
          <p>
            Developer&rsquo;s House is a team of students who loves tech and
            software engineering and aims to build projects together! We work
            together, prioritizing group development...
          </p>
          <NavLink to="/about">
            <Button>More about us</Button>
          </NavLink>
        </div>
        <div>
          <h2>Our projects</h2>
          <p>
            We works on different projects to diversifying our programming
            skills and deploys cool stuff in production.
          </p>
          <NavLink to="/projects">
            <Button>More projects.</Button>
          </NavLink>
        </div>

        <div>
          <h2>What technologies do we use ?</h2>
          <p>
            At DevHouse, we mainly use JavaScript, Typescript, Golang, Docker
            and Kubernetes. Our mainly goal is to teach to our developers by
            creating projects, which means we are not limited to Typescript,
            Golang... We are also planning to contribute to Open Source!
          </p>
        </div>

        <div>
          <h2>Who is part of the project ?</h2>
          <p>
            Anyone can be part of Developer&rsquo;s House since you have the
            basics of programming science and you want to learn!
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
