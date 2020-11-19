import React, {ReactElement, useState} from 'react';
import {NavigationItem} from "./Menu/MenuItem";
import {NavLink} from "react-router-dom";
import OnlyMobiles from "./Menu/OnlyMobiles";
import {GiHamburgerMenu} from 'react-icons/gi';
import {useDispatch, useSelector} from 'react-redux';
import {updateTheme} from 'state/modules/theme';
import {loginUser} from "../../state/modules/user/actions";
import {NavigationContainer} from './Menu/MenuContainer';

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
    }

    return (
        <NavigationContainer open={open} onClick={globalClick}>
            <OnlyMobiles>
                <NavigationItem onClick={switchOpen}>
                    Developer's House
                    <OnlyMobiles style={{float: 'right', verticalAlign: 'middle'}}>
                        <GiHamburgerMenu
                            style={{transform: `rotate(${open ? '90' : '0'}deg)`, scale: 2, transition: 'all 250ms'}}/>
                    </OnlyMobiles>
                </NavigationItem>
            </OnlyMobiles>
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
            <NavigationItem onClick={() => dispatch(loginUser())}>
                Login
            </NavigationItem>
        </NavigationContainer>
    );
}
