import React, { useCallback, ReactElement, FC } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaUser } from "react-icons/fa";
import { BsMoon } from "react-icons/bs";
import { Trans, useTranslation } from "react-i18next";
import { CgClose } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { AiFillWarning } from "react-icons/ai";
import { NavigationItem } from "./Menu/MenuItem";
import { NavigationContainer } from "./Menu/MenuContainer";
import { DrawerContent } from "./Menu/DrawerContent";
import styles from "./Menu/navigation.module.scss";
import UserAvatarStatus from "../UserAvatarStatus/UserAvatarStatus";
import globalStyles from "../../styles/Global.module.scss";
import { useNotificationsManager } from "../../hooks/useNotifications";
import { useLogin } from "../../state/slices/account/hooks";
import { setTheme } from "../../state/slices/theme/theme";
import { useTheme } from "../../state/slices/theme/hooks";
import { useScrollPosition } from "../../hooks/useScroll";
import { useSwitcher } from "../../hooks/useSwitcher";
import { useStartsWith } from "../../hooks/usePath";
import { SmallLoader } from "../SmallLoader/SmallLoader";

const UserButton: FC<{ padding?: string }> = ({ padding }) => {
  const { login, status, user } = useLogin();
  return (
    <NavigationItem
      css={{ padding }}
      onClick={(e) => {
        e.stopPropagation();
        if (!user) login();
      }}
      className={styles.right}
    >
      {status === "available" &&
        (user ? (
          <NavLink to="/settings">
            <div style={{ display: "flex", alignItems: "center" }}>
              <UserAvatarStatus
                style={{
                  width: "1.25rem",
                  display: "flex",
                  transform: "scale(1.35)",
                }}
                animate
                status={false}
                statusColor="transparent"
                avatar={`https://imageproxy.developershouse.xyz/120x120/https://s3.developershouse.xyz/${user?.avatar}`}
              />
              <span className={styles.username}>{user?.username}</span>
            </div>
          </NavLink>
        ) : (
          <FaUser />
        ))}
      {status === "failed" && <AiFillWarning />}
      {status === "loading" && <SmallLoader />}
    </NavigationItem>
  );
};

export const Menu = (): ReactElement => {
  const [open, switchOpen, setOpen] = useSwitcher();
  const blacklisted = useStartsWith("/settings");
  const transparent = useScrollPosition() === 0 && !blacklisted;
  const dispatch = useDispatch();

  const dark = useTheme() === "light";
  const { addNotification } = useNotificationsManager();

  const switchOpenClick = useCallback(() => {
    if (open) setOpen(false);
    return true;
  }, [setOpen, open]);
  const { t } = useTranslation("layout");

  return (
    <NavigationContainer
      open={open}
      className={transparent ? styles.transparent : ""}
      onClick={switchOpen}
    >
      <div className={`${styles.primed} ${globalStyles.onlyMobiles}`}>
        <NavigationItem onClick={switchOpen}>
          <h3>Developer&rsquo;s House</h3>
          {open ? (
            <CgClose
              style={{
                scale: 2,
                transition: "all 250ms",
              }}
            />
          ) : (
            <GiHamburgerMenu
              style={{
                scale: 2,
                transition: "all 250ms",
              }}
            />
          )}
        </NavigationItem>
      </div>
      <DrawerContent className={styles.links} onClick={switchOpenClick}>
        <NavLink to="/" exact activeClassName={styles.active}>
          <NavigationItem>
            <Trans t={t} i18nKey="menu.home" />
          </NavigationItem>
        </NavLink>
        <NavLink to="/projects" activeClassName={styles.active}>
          <NavigationItem>
            <Trans t={t} i18nKey="menu.projects" />
          </NavigationItem>
        </NavLink>
        <NavLink to="/members" activeClassName={styles.active}>
          <NavigationItem>
            <Trans t={t} i18nKey="menu.members" />
          </NavigationItem>
        </NavLink>
        <NavLink to="/about" activeClassName={styles.active}>
          <NavigationItem>
            <Trans t={t} i18nKey="menu.about" />
          </NavigationItem>
        </NavLink>
        <NavLink to="/contact" activeClassName={styles.active}>
          <NavigationItem>Contact</NavigationItem>
        </NavLink>
        <UserButton />
        <NavigationItem
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setTheme(dark ? "dark" : "light"));
            addNotification({
              level: "information",
              text: `Switched to ${dark ? "dark" : "light"} theme.`,
              time: 5000,
            });
          }}
        >
          {dark ? <BsMoon /> : <FaSun />}
          <div className={globalStyles.onlyMobiles}>
            <Trans
              t={t}
              i18nKey={`menu.theme.text.${!dark ? "light" : "dark"}`}
            />
          </div>
        </NavigationItem>
      </DrawerContent>
    </NavigationContainer>
  );
};
