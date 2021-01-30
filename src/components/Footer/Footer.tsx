import React from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  FaDiscord,
  FaInstagram,
  FaTwitter,
  BiCameraMovie,
} from "react-icons/all";
import { NavLink } from "react-router-dom";
import styles from "./Footer.module.scss";

const Footer = (): React.ReactElement => {
  const { t } = useTranslation("components\\footer");

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <BiCameraMovie className={styles["website-icon"]} />
        <h3>
          <Trans t={t} i18nKey="left.imr" />
        </h3>
        <div className={styles["social-networks"]}>
          <a href="https://discord.com/invite/QECkmy8TqC" target="blank">
            <FaDiscord />
          </a>
          <a href="https://instagram.com" target="blank">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="blank">
            <FaTwitter />
          </a>
        </div>
      </div>
      <div className={styles.right}>
        <h3>
          <Trans t={t} i18nKey="right.mainTitle" />
        </h3>
        <hr />
        <div className={styles.container}>
          <div className={styles.items}>
            <h3>
              <Trans t={t} i18nKey="right.containers.one.title" />
            </h3>
            <NavLink to="/" exact>
              <Trans t={t} i18nKey="right.containers.one.home" />
            </NavLink>
            <NavLink to="/about" exact>
              <Trans t={t} i18nKey="right.containers.one.about" />
            </NavLink>
            <NavLink to="/support" exact>
              <Trans t={t} i18nKey="right.containers.one.support" />
            </NavLink>
            <NavLink to="/contact" exact>
              <Trans t={t} i18nKey="right.containers.one.contact" />
            </NavLink>
          </div>
          <div className={styles.items}>
            <h3>
              <Trans t={t} i18nKey="right.containers.two.title" />
            </h3>
            <a href="https://developershouse.xyz" target="blank">
              <Trans t={t} i18nKey="right.containers.two.website" />
            </a>
            <a href="https://developershouse.xyz/about" target="blank">
              <Trans t={t} i18nKey="right.containers.two.about" />
            </a>
            <a href="https://discord.com/invite/QECkmy8TqC" target="blank">
              <Trans t={t} i18nKey="right.containers.two.discord" />
            </a>
          </div>
          <div className={styles.items}>
            <h3>
              <Trans t={t} i18nKey="right.containers.three.title" />
            </h3>
            <NavLink to="/" exact>
              <Trans t={t} i18nKey="right.containers.three.gui" />
            </NavLink>
            <NavLink to="/" exact>
              <Trans t={t} i18nKey="right.containers.three.mediaRegistration" />
            </NavLink>
            <NavLink to="/" exact>
              <Trans t={t} i18nKey="right.containers.three.mediaUpdate" />
            </NavLink>
            <NavLink to="/" exact>
              <Trans t={t} i18nKey="right.containers.three.mediaAlert" />
            </NavLink>
          </div>
          <div className={styles.items}>
            <h3>
              <Trans t={t} i18nKey="right.containers.four.title" />
            </h3>
            <NavLink to="/status" exact>
              <Trans t={t} i18nKey="right.containers.four.status" />
            </NavLink>
            <NavLink to="/conditions" exact>
              <Trans t={t} i18nKey="right.containers.four.conditions" />
            </NavLink>
            <NavLink to="/legal-mentions" exact>
              <Trans t={t} i18nKey="right.containers.four.legalMentions" />
            </NavLink>
            <NavLink to="/acknowledgements" exact>
              <Trans t={t} i18nKey="right.containers.four.acknowledgements" />
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
