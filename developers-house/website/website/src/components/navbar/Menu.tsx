import React, { ReactElement, useState } from 'react';
import MenuItem from "./Menu/MenuItem";
import MenuContainer from "./Menu/MenuContainer";
import { NavLink } from "react-router-dom";
import PrimedMenuItem from "./Menu/PrimedMenuContainer";
import OnlyMobiles from "./Menu/OnlyMobiles";
import { GiHamburgerMenu } from 'react-icons/gi';

export function Menu(): ReactElement {
    const [open, setOpen] = useState<boolean>(false);
    const switchOpen = (): void => setOpen(!open);
    return (
        <MenuContainer open={open}>
            <PrimedMenuItem onClick={switchOpen}>
                Developer's House
                    <OnlyMobiles style={{ float: 'right', verticalAlign: 'middle' }}>
                    <GiHamburgerMenu style={{ transform: `rotate(${open ? '90' : '0'}deg)`, transition: 'all 250ms' }} />
                </OnlyMobiles>
            </PrimedMenuItem>

            <MenuItem as={NavLink} to={'/'} exact>
                Home
                </MenuItem>
                <MenuItem as={NavLink} to={'/members'}>
                Members
            </MenuItem>
            <MenuItem as={NavLink} to={'/about'}>
                About
            </MenuItem>
        </MenuContainer>
    );
}
