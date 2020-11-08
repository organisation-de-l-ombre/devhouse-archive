import { FC } from 'react';
import styles from './ButtonContainer.module.scss';

export const ButtonContainer: FC = ({children}) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
};