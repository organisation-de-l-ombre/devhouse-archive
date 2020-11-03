import { PropsWithChildren } from 'react';
import styles from '../styles/Warning.module.css';

export const Warning: React.FC = ({ children }) => {
    return (
        <div className={styles.warning}>
            { children }
        </div>
    )
};