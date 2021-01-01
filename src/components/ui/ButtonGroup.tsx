import React from 'react';
import {SimplifiedHTMLProps} from "./Button";
import styles from './button.module.scss';

type ButtonGroupProps = {
    borderRadius?: string;
    buttonPadding?: string;
    direction?: string;
};

const ButtonGroup:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.group].join(' ')} {...props} />;

export default ButtonGroup;
