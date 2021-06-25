/* eslint-disable prettier/prettier */
import React, { FC, ReactElement, useCallback } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiMessage2Fill, RiPencilRuler2Line } from "react-icons/ri";
import {
  Button,
  ButtonLink,
  NavLinkButton,
} from "@components/new/Button/Button";
import ButtonGroup from "@components/new/Button/ButtonGroup";
import { BsPeopleFill, BsPeople, BsLayersFill } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { Banner } from "@components/Banner/Banner";
import { Flex } from "@components/new/Flex/FlexContainer";
import { Stack } from "@components/new/Stack/Stack";
import { Gate } from "@components/FeatureGate/FeatureGateProvider";
import { discordServer } from "../../constants";
import styles from "./Home.module.scss";

const shareAvailable = typeof window !== "undefined" && !!navigator.share;

const Section: FC = (props) => (
  <Flex
    {...props}
    justifyContent="space-evenly"
    justifyItems="center"
    alignItems="center"
    flexDirection="row"
    flexWrap
    className={styles.section}
  />
);

export default function HomePage(): ReactElement {
  const share = useCallback(() => {
    navigator.share({
      title: "Developer's House",
      text: "Discover Developer's House today!",
      url: document.location.toString(),
    });
  }, []);

  return (
    <Flex flexDirection="column">
      <Flex
        justifyItems="center"
        flexDirection="column"
        alignItems="center"
        className={styles.homeHeader}
      >
        <Banner className={styles.banner} />
        <h1 css={{ marginBottom: "2rem" }}>
          We are young developers who learn to work as a team by developing some
          nice, diversified and interesting projects.
        </h1>
        <ButtonGroup outline flexWrap>
          <Gate gate="feature_projects">
            {() => (
              <NavLinkButton to="/projects">
                <RiPencilRuler2Line />
                Projects
              </NavLinkButton>
            )}
          </Gate>
          <Gate gate="feature_members">
            {() => (
              <NavLinkButton to="/members">
                <BsPeople />
                Members
              </NavLinkButton>
            )}
          </Gate>
          <ButtonLink href={discordServer} target="blank">
            <FaDiscord />
            Discord server
          </ButtonLink>
        </ButtonGroup>
      </Flex>
      <Flex flexDirection="column" className={styles.coloring}>
        <Section>
          <Stack className={styles.text}>
            <h1>Who are we?</h1>
            <p>
              We are yound developers who learn progressively development in
              different programming languages and with different
              technologies/tools. Our goal is to learn working with a team, and
              to learn the job of developer. We create awesome and crazy
              projects to learn but also to propose alternatives to existing
              projects or useful functionnalities for you.
            </p>
          </Stack>
          <BsPeopleFill className={styles.image} />
        </Section>
        <Section>
          <Stack className={styles.text}>
            <h1>Our projects</h1>
            <p>
              All the Developer&#39;s House projects are issued from members who
              want to build their project with the team. Another of our goals is
              to propose alternatives to existing projects to improve
              functionalities, efficiency, design or other... Alternatives make
              the web to evoluate and are necessary, they allow people to use
              what they prefer the most, and sometimes to avoid using services
              or projects managed by large enterprises. It can also propose a
              different approach, a different functioning, and it is this which
              please you particularly.
            </p>
            <p>
              Our projects are enough diversified. For the moment we have
              projects around image manipulation & edition, cinematography and
              entertainment/fun. To know more, click on the button below.
            </p>
            <Gate gate="feature_projects">
              {() => (
                <ButtonGroup className={styles["buttons-group"]}>
                  <NavLinkButton to="/projects">View projects</NavLinkButton>
                </ButtonGroup>
              )}
            </Gate>
          </Stack>
          <MdWork className={styles.image} />
        </Section>
        <Section>
          <Stack className={styles.text}>
            <h1>Technologies and tools used</h1>
            <p>
              As we learn the job of developers, for a good begenning we decided
              to use powerful, flexible, complete and reliable technologies.
              Concerning programming languages, we use the most popular,
              reliable, and the choices are adapted to our needs.
            </p>
            <h2>Some technologies we use</h2>
            <ul>
              <li>
                <a href="https://www.docker.com/" target="blank">
                  Docker
                </a>
              </li>
              <li>
                <a href="https://kubernetes.io/" target="blank">
                  Kubernettes
                </a>
              </li>
              <li>
                <a href="https://gitlab.com/" target="blank">
                  GitLab
                </a>
              </li>
            </ul>
            <h2>Some programming languages we use</h2>
            <ul>
              <li>JavaScript/TypeScript</li>
              <li>Golang</li>
              <li>Rust</li>
            </ul>
          </Stack>
          <BsLayersFill className={styles.image} />
        </Section>
        <Section>
          <Stack className={styles.text}>
            <h1>Our members</h1>
            <p>
              One of the main goals of Developer&#39;s House is to learn
              development and to work in team. This is why this project exists.
              And even if we gain in experience, there always are people who
              want to initiate to development. So we let the possibility to any
              person who is interrested in development and who already have
              basics and want to learn to join us to make grow our project, and
              to allow people to improve their skills.
            </p>
            <p>
              A minimum of willpower and having basics, you wan join us to
              participate to an awesome project!
            </p>
            <ButtonGroup flexWrap>
              <Gate gate="feature_members">
                {() => (
                  <NavLinkButton to="/members">View members</NavLinkButton>
                )}
              </Gate>
              <Gate gate="feature_join">
                {() => (
                  <NavLinkButton to="/recruitments/apply">
                    Join us now
                  </NavLinkButton>
                )}
              </Gate>
            </ButtonGroup>
          </Stack>
          <BsPeople className={styles.image} />
        </Section>
        <Section>
          <Stack className={styles.text}>
            <h1>Stay in contact with Developer&#39;s House</h1>
            <p>
              You are curious to know more about us, or you need more precision
              ? We are available for you! It is by having care in us which you
              support us 💪 For a question, a need of presicion, a particular
              demand, we are opened and ready to listen you. Below you find all
              you need to contact us, hoping it will help you 👀
            </p>
            <ButtonGroup flexWrap>
              <Gate gate="feature_about">
                {() => <NavLinkButton to="/about">Learn more</NavLinkButton>}
              </Gate>
              <Gate gate="feature_contact">
                {() => (
                  <NavLinkButton to="/contact">Contact form</NavLinkButton>
                )}
              </Gate>
              <ButtonLink href="mailto:matthieu@developershouse.xyz">
                E-mail
              </ButtonLink>
              <ButtonLink href={discordServer} target="blank">
                Discord server
              </ButtonLink>
              {shareAvailable && (
                <Button onClick={share}>Share the project</Button>
              )}
            </ButtonGroup>
          </Stack>
          <RiMessage2Fill className={styles.image} />
        </Section>
      </Flex>
    </Flex>
  );
}
