import React from 'react';
import styles from "./button.module.scss";

export type SimplifiedHTMLProps<T> = React.DetailedHTMLProps<React.HTMLAttributes<T>, T> & { variant?: string };

const Button: React.FC<SimplifiedHTMLProps<HTMLButtonElement>>
    = ({className, variant, ...props}) =>
    <button className={[className, styles.button, styles[`button__${variant}`]].join(' ')} {...props} />;

const ButtonImage:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.image].join(' ')} {...props} />;

export default Button;
export {
    Button,
    ButtonImage
};
