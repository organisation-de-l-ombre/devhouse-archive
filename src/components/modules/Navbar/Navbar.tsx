import React from "react";
import { useLocation } from "react-router-dom";
import { useNavbar } from "@hooks/Navbar";
import routeWithOnlyContent from "@lib/routeWithOnlyContent";
import {
  Drawer,
  DrawerBackdrop,
  DrawerEnd,
  DrawerStart,
  MobileNavigation,
} from "@components/modules/Navbar/Drawer";
import { NotificationsModal, LanguageModal, RippleEffect } from "../../ui";
import styles from "./Navbar.module.scss";

const Navbar = (): React.ReactElement => {
  const { open, manageNavbar } = useNavbar();
  const [languageWindowOpen, setLanguageWindowOpen] = React.useState<boolean>(
    false
  );
  const [
    notificationsWindowOpen,
    setNotificationsWindowOpen,
  ] = React.useState<boolean>(false);
  const { pathname } = useLocation();

  React.useEffect((): void => {
    document.body.style.overflowY = open ? "hidden" : "auto";
  }, [open]);

  if (
    routeWithOnlyContent.navbarBlacklist.filter((route: string): boolean =>
      pathname.startsWith(route)
    ).length
  ) {
    return <></>;
  }

  const classes = `${styles.navbar} ${
    pathname.startsWith("/movies/title") ? styles["force-dark-mode"] : ""
  }${open ? ` ${styles.open}` : ""}`;

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
      <nav className={classes}>
        <RippleEffect navbar className={styles.ripple} onClick={manageNavbar}>
          <MobileNavigation open={open} />
        </RippleEffect>
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
