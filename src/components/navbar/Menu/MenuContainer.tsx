/*
 * Component that handles the position of the Menu
 */

import styled from "styled-components";
import MenuItem from "./MenuItem";
import PrimedMenuItem from "./PrimedMenuContainer";
import OnlyMobiles from "./OnlyMobiles";

export default styled.div<{ open: boolean }>`
    // Position Stuff
    top: 0;
    width: 100%;
    z-index: 4;
    position: absolute;
    // Coloring and internal style
    background-color: ${(props): string => props.theme.background.primary};
    vertical-align: middle;
    // Layout
    display: flex;
    flex-flow: row no-wrap;
    box-shadow: black 0 0 11px;
    @media screen and (max-width: 640px) {
      flex-flow: column wrap;
      ${OnlyMobiles} {
        display: inline-block;
      }
      ${MenuItem} {
        flex: 1;
        display: ${(opt): string => (opt.open ? 'inline-block' : 'none')};
      }
      ${PrimedMenuItem} {
        flex: 1;
        display: inline-block;
      }
    }
`;
