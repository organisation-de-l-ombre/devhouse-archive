import React, { ReactElement, useState } from 'react';
import MenuItem from "./Menu/MenuItem";
import MenuContainer from "./Menu/MenuContainer";
import { NavLink } from "react-router-dom";
import PrimedMenuItem from "./Menu/PrimedMenuContainer";
import OnlyMobiles from "./Menu/OnlyMobiles";
import { GiHamburgerMenu } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { updateTheme } from 'state/modules/theme';
import Ripples from 'react-ripples';

export function Menu(): ReactElement {
    const [open, setOpen] = useState<boolean>(false);
    const switchOpen = (): void => setOpen(!open);
    const dispatch = useDispatch();
    const dark = useSelector((e) => e.theme.theme === 'light');
    return (
        <MenuContainer open={open}>
            <PrimedMenuItem onClick={switchOpen} as={NavLink} to={'/'} exact>
                Developer's House
                    <OnlyMobiles style={{ float: 'right', verticalAlign: 'middle' }}>
                    <GiHamburgerMenu style={{ transform: `rotate(${open ? '90' : '0'}deg)`, transition: 'all 250ms' }} />
                </OnlyMobiles>
            </PrimedMenuItem>
            <Ripples>
                <MenuItem as={NavLink} to={'/members'}>
                    Members
                </MenuItem>
            </Ripples>
            <Ripples>
                <MenuItem as={NavLink} to={'/about'}>
                    About
            </MenuItem>
            </Ripples>
            <Ripples>
                <MenuItem as="a" onClick={() => dispatch(updateTheme(dark ? 'dark' : 'light'))}>
                    Switch to {dark ? 'dark' : 'light'} theme
            </MenuItem>
            </Ripples>
        </MenuContainer>
    );
}
