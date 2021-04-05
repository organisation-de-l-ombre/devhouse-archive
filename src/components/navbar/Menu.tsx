import React, { ReactElement, useState, useCallback, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "state/modules/theme";
import { FaSun, FaUser } from "react-icons/fa";
import { BsMoon } from "react-icons/bs";
import { Trans, useTranslation } from "react-i18next";
import { CgClose } from "react-icons/cg";
import { NavigationItem } from "./Menu/MenuItem";
import { loginUser } from "../../state/modules/user/actions";
import { NavigationContainer } from "./Menu/MenuContainer";
import { DrawerContent } from "./Menu/DrawerContent";
import styles from "./Menu/navigation.module.scss";
import UserAvatarStatus from "../ui/UserAvatarStatus/UserAvatarStatus";
import globalStyles from "../../styles/Global.module.scss";
import Tooltip from "../tooltip/Tooltip";
import { useNotificationsManager } from "../../hooks/Notifications/Notifications";

export function Menu(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const switchOpen = (): void => setOpen(!open);
  const dispatch = useDispatch();
  const page = useLocation();
  const dark = useSelector((e) => e.theme.theme === "light");
  const { addNotification } = useNotificationsManager();

  const [transparent, setTransparent] = useState(window.scrollY > 0);

  const switchOpenClick = useCallback(() => {
    if (open) setOpen(false);
    return true;
  }, [open]);

  const listener = useCallback(() => {
    if (!page.pathname.includes("settings")) {
      const scroll = window.scrollY > 0;
      setTransparent(!scroll);
    } else {
      setTransparent(false);
    }
  }, [page]);

  useEffect(() => {
    listener();
    document.addEventListener("scroll", listener);
    return () => document.removeEventListener("scroll", listener);
  }, [listener, page]);

  const userState = useSelector((s) => s.user);
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
      <DrawerContent onClick={switchOpenClick}>
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
          <NavigationItem onClick={switchOpenClick}>
            <Trans t={t} i18nKey="menu.about" />
          </NavigationItem>
        </NavLink>
        <NavLink to="/contact" activeClassName={styles.active}>
          <NavigationItem>Contact</NavigationItem>
        </NavLink>
        {userState.loggedIn ? (
          <NavLink to="/settings" style={{ marginLeft: "auto" }}>
            <NavigationItem style={{ padding: "auto" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserAvatarStatus
                  style={{
                    width: "1.25rem",
                    display: "flex",
                    transform: "scale(1.5)",
                  }}
                  animate
                  statusColor="gray"
                  avatar={`https://s3.developershouse.xyz/${userState.user?.avatar}`}
                />
                <span className={styles.username}>
                  {userState.user?.username}
                </span>
              </div>
            </NavigationItem>
          </NavLink>
        ) : (
          <Tooltip
            className={styles.right}
            direction="bottom"
            tooltip={t("menu.login.tooltip")}
          >
            <NavigationItem onClick={() => dispatch(loginUser())}>
              <FaUser />
              <span className={globalStyles.onlyMobiles}>Login</span>
            </NavigationItem>
          </Tooltip>
        )}
        <Tooltip direction="bottom" tooltip={t("menu.theme.tooltip")}>
          <NavigationItem
            onClick={(e) => {
              e.stopPropagation();
              dispatch(updateTheme(dark ? "dark" : "light"));
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
        </Tooltip>
      </DrawerContent>
    </NavigationContainer>
  );
}
