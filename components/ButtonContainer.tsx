/*
 * Contains a list a buttons
 */

 import styles from './ButtonContainer.module.scss';

export const ButtonContainer: React.FC = ({ children }) => {
    return (
        <div className={styles.container}>
            { children }
        </div>
    )
}