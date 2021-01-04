import React, { ReactElement } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiPencilRuler2Line } from "react-icons/ri";
import Button, { ButtonImage } from "components/ui/Button";
import ButtonGroup from "components/ui/ButtonGroup";
import {
  Card,
  CardFlexContainer,
  CardPadding,
  CardSection,
} from "components/ui/Card";
import { TitleBox } from "components/ui/TitleBox";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsPeople } from "react-icons/all";
import styles from "./Home.module.scss";

export default function HomePage(): ReactElement {
  const theme = useSelector((s) => s.theme.theme);
  // eslint-disable-next-line import/no-dynamic-require,global-require,@typescript-eslint/no-var-requires
  const imageURL = require(`../../assets/${theme}/header-waves.svg`);
  return (
    <>
      <div
        className={styles.homeHeader}
        style={{
          backgroundImage: `url(${imageURL})`,
        }}
      >
        <TitleBox className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Developer&rsquo;s House</h1>
          <p className={styles.headerSubtext}>
            We are a small team of developers who seek to learn with a team of
            people, our goal is to learn how to work as a team.
          </p>
          <ButtonGroup>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/r8RC2TjnFd"
            >
              <Button>
                <ButtonImage>
                  <FaDiscord />
                </ButtonImage>
                Discord server
              </Button>
            </a>
            <NavLink to="/projects">
              <Button>
                <ButtonImage>
                  <RiPencilRuler2Line />
                </ButtonImage>
                View projects
              </Button>
            </NavLink>
            <NavLink to="/members">
              <Button>
                <ButtonImage>
                  <BsPeople />
                </ButtonImage>
                View members
              </Button>
            </NavLink>
          </ButtonGroup>
        </TitleBox>
      </div>
    </>
  );
}
