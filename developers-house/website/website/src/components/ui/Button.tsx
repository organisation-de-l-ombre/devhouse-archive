import React from 'react';
import styles from "./button.module.scss";

type Variants = 'no_radius';

type ButtonProps = {
    variant?: Variants;
};

type SimplifiedHTMLProps<T> =  React.DetailedHTMLProps<React.HTMLAttributes<T>,T> & { variant?: string };

const Button: React.FC<SimplifiedHTMLProps<HTMLButtonElement>>
    = ({ className, variant, ...props }) =>
        <button className={[className, styles.button, styles[`button__${variant}`]].join(' ')} {...props} />;

const ButtonImage:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({ className, ...props }) =>
        <></>;

export default Button;
export {
    Button,
    ButtonImage
};
