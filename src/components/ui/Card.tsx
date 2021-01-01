import React from "react";
import styles from "./card.module.scss";
import {SimplifiedHTMLProps} from "./Button";

export const Card:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.card].join(' ')} {...props} />;

export const CardPadding:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.padding].join(' ')} {...props} />;

export const CardHeader:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.header].join(' ')} {...props} />;

export const CardSection:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.section].join(' ')} {...props} />;


export const CardFlexContainer:
    React.FC<SimplifiedHTMLProps<HTMLImageElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.container].join(' ')} {...props} />;
