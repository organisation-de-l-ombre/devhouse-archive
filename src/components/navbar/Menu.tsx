import React, { ReactElement, useState } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { updateTheme } from "state/modules/theme";
import { BsMoon, FaSun, FaUser } from "react-icons/all";
import { OnlyMobiles } from "./Menu/OnlyMobiles";
import { NavigationItem } from "./Menu/MenuItem";
import { loginUser } from "../../state/modules/user/actions";
import { NavigationContainer } from "./Menu/MenuContainer";
import { DrawerContent } from "./Menu/DrawerContent";
import styles from "./Menu/navigation.module.scss";
import UserAvatarStatus from "../ui/UserAvatarStatus";

export function Menu(): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const switchOpen = (): void => setOpen(!open);
  const dispatch = useDispatch();
  const dark = useSelector((e) => e.theme.theme === "light");
  const globalClick = () => open && setOpen(false);

  const switchOpenClick = () => {
    if (open) setOpen(false);
    return true;
  };

  const userState = useSelector((s) => s.user);

  return (
    <NavigationContainer open={open} onClick={globalClick}>
      <OnlyMobiles className={styles.primed}>
        <NavigationItem
          onClick={switchOpen}
          className={styles["items-transition"]}
        >
          <h3>Developer&rsquo;s House</h3>
          <GiHamburgerMenu
            style={{
              transform: `rotate(${open ? "90" : "0"}deg)`,
              scale: 2,
              transition: "all 250ms",
            }}
          />
        </NavigationItem>
      </OnlyMobiles>
      <DrawerContent onClick={switchOpenClick}>
        <NavLink
          to="/"
          exact
          className={styles["items-transition"]}
          activeClassName={styles.active}
        >
          <NavigationItem>Home</NavigationItem>
        </NavLink>
        <NavLink
          to="/projects"
          className={styles["items-transition"]}
          activeClassName={styles.active}
        >
          <NavigationItem>Projects</NavigationItem>
        </NavLink>
        <NavLink
          to="/members"
          className={styles["items-transition"]}
          activeClassName={styles.active}
        >
          <NavigationItem>Members</NavigationItem>
        </NavLink>
        <NavLink
          to="/about"
          className={styles["items-transition"]}
          activeClassName={styles.active}
        >
          <NavigationItem onClick={switchOpenClick}>About</NavigationItem>
        </NavLink>
        <NavLink
          to="/contact"
          className={styles["items-transition"]}
          activeClassName={styles.active}
        >
          <NavigationItem>Contact</NavigationItem>
        </NavLink>
        {userState.loggedIn ? (
          <NavLink
            to="/settings"
            className={styles["items-transition"]}
            style={{ marginLeft: "auto" }}
          >
            <NavigationItem style={{ padding: "auto" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserAvatarStatus
                  style={{
                    paddingRight: "0.45rem",
                    width: "1.25rem",
                    display: "flex",
                  }}
                  animate
                  statusColor="gray"
                  avatar={`https://s3.developershouse.xyz/${userState.user?.avatar}`}
                />
                {userState.user?.username}
              </div>
            </NavigationItem>
          </NavLink>
        ) : (
          <NavigationItem
            style={{
              marginLeft: "auto",
            }}
            className={styles["items-transition"]}
            onClick={() => dispatch(loginUser())}
          >
            <FaUser />
            <OnlyMobiles>Login</OnlyMobiles>
          </NavigationItem>
        )}
        <NavigationItem
          onClick={(e) => {
            e.stopPropagation();
            dispatch(updateTheme(dark ? "dark" : "light"));
          }}
          className={styles["items-transition"]}
        >
          {dark ? <BsMoon /> : <FaSun />}
          <OnlyMobiles>Turn on the {dark ? "light" : "dark"} theme</OnlyMobiles>
        </NavigationItem>
      </DrawerContent>
    </NavigationContainer>
  );
}
