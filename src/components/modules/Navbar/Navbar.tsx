import React, { FC, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useNavbar from "@hooks/useNavbar";
import routeWithOnlyContent from "@lib/routeWithOnlyContent";
import {
  Drawer,
  DrawerBackdrop,
  DrawerEnd,
  DrawerStart,
  MobileNavigation,
} from "@components/modules/Navbar/Drawer";
import classnames from "classnames";
import BodyContext from "@contexts/body";
import { NotificationsModal, LanguageModal } from "../../ui";
import styles from "./Navbar.module.scss";

const Navbar: FC = () => {
  const { open, manageNavbar } = useNavbar();
  const { setScroll } = useContext(BodyContext);
  const [languageWindowOpen, setLanguageWindowOpen] = useState<boolean>(false);
  const [notificationsWindowOpen, setNotificationsWindowOpen] =
    useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect((): void => {
    setScroll(!open);
  }, [open, setScroll]);

  if (
    routeWithOnlyContent.navbarBlacklist.filter((route: string): boolean =>
      pathname.startsWith(route)
    ).length
  ) {
    return null;
  }

  return (
    <>
      <LanguageModal
        languageWindowOpen={languageWindowOpen}
        setLanguageWindowOpen={setLanguageWindowOpen}
      />
      <NotificationsModal
        open={notificationsWindowOpen}
        setOpen={setNotificationsWindowOpen}
      />
      <nav
        className={classnames(styles.navbar, {
          [styles["force-dark-mode"]]: pathname.startsWith("/movies/title"),
          [styles.open]: open,
        })}
      >
        <MobileNavigation open={open} manageNavbar={manageNavbar} />
        <div className={styles.separator} />
        <DrawerBackdrop manageNavbar={manageNavbar} />
        <Drawer>
          <DrawerStart manageNavbar={manageNavbar} />
          <DrawerEnd
            open={open}
            manageNavbar={manageNavbar}
            setLanguageWindowOpen={setLanguageWindowOpen}
            setNotificationsWindowOpen={setNotificationsWindowOpen}
          />
        </Drawer>
      </nav>
    </>
  );
};

export default Navbar;
