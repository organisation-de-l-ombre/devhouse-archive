import React, { FC } from "react";
import { useTranslation, Trans } from "react-i18next";
import { FaDiscord, FaInstagram, FaTwitter } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import routeWithOnlyContent from "@lib/routeWithOnlyContent";
import styles from "./Footer.module.scss";

const Footer: FC = () => {
  const { t } = useTranslation("components\\modules\\footer\\footer");
  const { pathname } = useLocation();

  if (
    routeWithOnlyContent.footerBlacklist.filter((route: string): boolean =>
      pathname.startsWith(route)
    ).length
  ) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <img src="/icons/logo-full128.png" alt="IMR logo" draggable={false} />
        </div>
        <h1>
          <Trans
            t={t}
            i18nKey="left.imr"
            values={{ year: new Date().getFullYear() }}
          />
        </h1>
        <div className={styles["social-networks"]}>
          <a
            href="https://discord.com/invite/QECkmy8TqC"
            target="blank"
            title="Discord"
            aria-label="Discord"
          >
            <FaDiscord />
          </a>
          <a
            href="https://instagram.com"
            target="blank"
            title="Instagram"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://twitter.com"
            target="blank"
            title="Twitter"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
        </div>
      </div>
      <div className={styles.right}>
        <h1>
          <Trans t={t} i18nKey="right.mainTitle" />
        </h1>
        <hr />
        <div className={styles.sections}>
          <div>
            <h1>
              <Trans t={t} i18nKey="right.containers.0.title" />
            </h1>
            <NavLink to="/" exact>
              <Trans t={t} i18nKey="right.containers.0.home" />
            </NavLink>
            <NavLink to="/about" exact>
              <Trans t={t} i18nKey="right.containers.0.about" />
            </NavLink>
            <NavLink to="/contact" exact>
              <Trans t={t} i18nKey="right.containers.0.contact" />
            </NavLink>
            <a
              href={`https://status.${document.location.hostname}`}
              target="blank"
            >
              <Trans t={t} i18nKey="right.containers.0.status" />
            </a>
          </div>
          <div>
            <h1>
              <Trans t={t} i18nKey="right.containers.1.title" />
            </h1>
            <a href="https://developershouse.xyz" target="blank">
              <Trans t={t} i18nKey="right.containers.1.website" />
            </a>
            <a href="https://developershouse.xyz/about" target="blank">
              <Trans t={t} i18nKey="right.containers.1.about" />
            </a>
            <a href="https://discord.com/invite/QECkmy8TqC" target="blank">
              <Trans t={t} i18nKey="right.containers.1.discord" />
            </a>
          </div>
          <div>
            <h1>
              <Trans t={t} i18nKey="right.containers.2.title" />
            </h1>
            <NavLink to="/wiki/internal/intro" exact>
              <Trans t={t} i18nKey="right.containers.2.support" />
            </NavLink>
            <NavLink to="/wiki/internal/referencing" exact>
              <Trans t={t} i18nKey="right.containers.2.mediaRegistration" />
            </NavLink>
            <a
              href={`https://docs.${document.location.hostname}`}
              target="blank"
            >
              <Trans t={t} i18nKey="right.containers.2.documentation" />
            </a>
            <NavLink to="/wiki/internal/developers" exact>
              <Trans t={t} i18nKey="right.containers.2.developers" />
            </NavLink>
          </div>
          <div>
            <h1>
              <Trans t={t} i18nKey="right.containers.3.title" />
            </h1>
            <NavLink to="/conditions" exact>
              <Trans t={t} i18nKey="right.containers.3.conditions" />
            </NavLink>
            <NavLink to="/legal-mentions" exact>
              <Trans t={t} i18nKey="right.containers.3.legalMentions" />
            </NavLink>
            <NavLink to="/chart" exact>
              <Trans t={t} i18nKey="right.containers.3.chart" />
            </NavLink>
            <NavLink to="/acknowledgements" exact>
              <Trans t={t} i18nKey="right.containers.3.acknowledgements" />
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
