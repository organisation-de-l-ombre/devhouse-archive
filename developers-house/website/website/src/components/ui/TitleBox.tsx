import React from 'react';
import {SimplifiedHTMLProps} from './Button';
import styles from './title.module.scss';

const TitleBox:
    React.FC<SimplifiedHTMLProps<HTMLDivElement>> =
    ({className, ...props}) =>
        <div className={[className, styles.title].join(' ')} {...props} />;

export {
    TitleBox
};
