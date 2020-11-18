import {FC, PropsWithChildren} from 'react';
import styles from './ButtonContainer.module.scss';

export const ButtonContainer: FC<{ horizontal?: boolean }> = ({children, horizontal}) => {
    return (
        <div className={`${styles.container}${horizontal ? ' ' + styles.horizontal : ''}`}>
            {children}
        </div>
    );
};