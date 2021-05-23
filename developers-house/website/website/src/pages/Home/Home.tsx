/* eslint-disable prettier/prettier */
import React, { ReactElement, useCallback } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiMessage2Fill, RiPencilRuler2Line } from "react-icons/ri";
import {
  Button,
  ButtonLink,
  NavLinkButton,
} from "components/new/Button/Button";
import ButtonGroup from "components/new/Button/ButtonGroup";
import { BsPeopleFill, BsPeople, BsLayersFill } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import FlexContainer from "components/FlexContainer/FlexContainer";
import {PresentationSection, PresentationWrapper} from "components/Presentation/Presentation";
import { Banner } from "components/Banner/Banner";
import globalStyles from "../../styles/Global.module.scss";
import styles from "./Home.module.scss";
import { discordServer } from "../../constants";

const shareAvailable = !!navigator.share;

export default function HomePage(): ReactElement {
  const share = useCallback(() => {
    navigator.share({
      title: "Developer's House",
      text: "Discover Developer's House today!",
      url: document.location.toString(),
    });
  }, []);

  return (
    <FlexContainer className={globalStyles["flex-column"]}>
      <div className={styles.homeHeaderRoot}>
        <div className={styles.homeHeader}>
          <Banner className={styles.banner} />
          <h1 className={styles.headerSubtext}>
            We are young developers who learn to work as a team by developing
            some nice, diversified and interesting projects.
          </h1>
          <ButtonGroup outline flexWrap>
            <NavLinkButton to="/projects">
                <RiPencilRuler2Line />
              Projects
            </NavLinkButton>
            <NavLinkButton to="/members">
                <BsPeople />
              Members
            </NavLinkButton>
            <NavLinkButton to={discordServer} target="blank">
                <FaDiscord />
              Discord server
            </NavLinkButton>
          </ButtonGroup>
        </div>
      </div>
      <div className={styles.content}>
        <PresentationWrapper>
          <PresentationSection type="text">
            <h1 className={globalStyles["no-margin"]}>Who are we?</h1>
            <p>
              We are yound developers who learn progressively development in
              different programming languages and with different
              technologies/tools. Our goal is to learn working with a team, and
              to learn the job of developer. We create awesome and crazy
              projects to learn but also to propose alternatives to existing
              projects or useful functionnalities for you.
            </p>
          </PresentationSection>
          <PresentationSection type="picture">
            <BsPeopleFill />
          </PresentationSection>
        </PresentationWrapper>
        <PresentationWrapper reversed>
          <PresentationSection type="text">
            <h1 className={globalStyles["no-margin"]}>Our projects</h1>
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
            <ButtonGroup className={styles["buttons-group"]}>
              <ButtonLink href="/projects">View projects</ButtonLink>
            </ButtonGroup>
          </PresentationSection>
          <PresentationSection type="picture">
            <MdWork />
          </PresentationSection>
        </PresentationWrapper>
        <PresentationWrapper>
          <PresentationSection type="text">
            <h1 className={globalStyles["no-margin"]}>
              Technologies/tools usage
            </h1>
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
          </PresentationSection>
          <PresentationSection type="picture">
            <BsLayersFill />
          </PresentationSection>
        </PresentationWrapper>
        <PresentationWrapper reversed>
          <PresentationSection type="text">
            <h1 className={globalStyles["no-margin"]}>Our members</h1>
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
              <ButtonLink href="/members">View members</ButtonLink>
              <ButtonLink href="/recruitments/apply">Join us now</ButtonLink>
            </ButtonGroup>
          </PresentationSection>
          <PresentationSection type="picture">
            <BsPeople />
          </PresentationSection>
        </PresentationWrapper>
        <PresentationWrapper>
          <PresentationSection type="text">
            <h1>Stay in contact with Developer&#39;s House</h1>
            <p>
              You are curious to know more about us, or you need more precision
              ? We are available for you! It is by having care in us which you
              support us 💪 For a question, a need of presicion, a particular
              demand, we are opened and ready to listen you. Below you find all
              you need to contact us, hoping it will help you 👀
            </p>
            <ButtonGroup flexWrap>
              <ButtonLink href="/about">Learn more</ButtonLink>
              <ButtonLink href="/contact">Contact form</ButtonLink>
              <ButtonLink href="mailto:contact.developershouse.xyz">
                E-mail
              </ButtonLink>
              <ButtonLink href={discordServer} target="blank">
                Discord server
              </ButtonLink>
              {shareAvailable && (
                <Button onClick={share}>Share the project</Button>
              )}
            </ButtonGroup>
          </PresentationSection>
          <PresentationSection type="picture">
            <RiMessage2Fill />
          </PresentationSection>
        </PresentationWrapper>
      </div>
    </FlexContainer>
  );
}
