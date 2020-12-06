import React, {ReactElement, useState} from 'react';
import {NavigationItem} from "./Menu/MenuItem";
import {NavLink} from "react-router-dom";
import OnlyMobiles from "./Menu/OnlyMobiles";
import {GiHamburgerMenu} from 'react-icons/gi';
import {useDispatch, useSelector} from 'react-redux';
import {updateTheme} from 'state/modules/theme';
import {loginUser} from "../../state/modules/user/actions";
import {NavigationContainer} from './Menu/MenuContainer';
import {DrawerContent} from "./Menu/DrawerContent";
import styles from "./Menu/navigation.module.scss";
import UserAvatarStatus from "../ui/UserAvatarStatus";

export function Menu(): ReactElement {
    const [open, setOpen] = useState<boolean>(false);
    const switchOpen = (): void => setOpen(!open);
    const dispatch = useDispatch();
    const dark = useSelector((e) => e.theme.theme === 'light');
    const globalClick = () => open && setOpen(false);

    const switchOpenClick = () => {
        if (open)
            setOpen(false);
        return true;
    };

    const userState = useSelector((s) => s.user);

    return (
        <NavigationContainer open={open} onClick={globalClick}>
            <OnlyMobiles className={styles.primed}>
                <NavigationItem onClick={switchOpen}>
                    <h3>
                        Developer's House
                    </h3>
                        <GiHamburgerMenu
                            style={{transform: `rotate(${open ? '90' : '0'}deg)`, scale: 2, transition: 'all 250ms'}}/>
                </NavigationItem>
            </OnlyMobiles>
            <DrawerContent>
                <NavLink to={'/'} exact>
                    <NavigationItem onClick={switchOpenClick}>
                        Home
                    </NavigationItem>
                </NavLink>
                <NavLink to={'/members'}>
                    <NavigationItem onClick={switchOpenClick}>
                        Members
                    </NavigationItem>
                </NavLink>
                <NavLink to={'/about'}>

                    <NavigationItem onClick={switchOpenClick}>
                        About
                    </NavigationItem>
                </NavLink>
                <NavigationItem onClick={() => switchOpenClick && dispatch(updateTheme(dark ? 'dark' : 'light'))}>
                    Switch to {dark ? 'dark' : 'light'} theme
                </NavigationItem>
                {
                    !userState.loggedIn &&
                    <NavigationItem className={styles.bottom} onClick={() => dispatch(loginUser())}>
                        Login
                    </NavigationItem>
                }
                {
                    userState.loggedIn && (
                        <NavLink to={"/settings"}>
                            <NavigationItem style={{ padding: '0.8em', }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <UserAvatarStatus style={{ paddingRight: '1em', width: '2em', height: '2em', display: 'inline' }} animate statusColor="gray" avatar={`https://s3.developershouse.xyz/${userState.user?.avatar}`} />
                                    { userState.user?.username }
                                </div>
                            </NavigationItem>
                        </NavLink>
                    )
                }
            </DrawerContent>
        </NavigationContainer>
    );
}
