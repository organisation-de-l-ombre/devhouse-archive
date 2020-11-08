import styles from './Warning.module.scss';
import React from 'react';

export const Warning: React.FC = ({children}) => {
    return (
        <div className={styles.warning}>
            {children}
        </div>
    )
};