/*
 * Component that handles the position of the Menu
 */

import styles from './navigation.module.scss';
import React from "react";

export const NavigationContainer:
    React.FC<
        React.DetailedHTMLProps<
            React.HTMLAttributes<HTMLDivElement>,
            HTMLDivElement>
        & { open: boolean; }
        > =
    ({ className, open, ...props }) =>
            <div className={[className, styles.container, open ? styles.open : ''].join(' ')} {...props} />
