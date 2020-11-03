import styles from './Layout.module.scss';
import { Warning } from './Warning';

/*
 * The layout of the page.
 */
export const Layout: React.FC = ({ children }) => {
    return (
        // The page container
        <div className={styles.app}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>{ } | Login</h1>
                </div>
                <div className={styles.content}>
                    <Warning>
                        <p>⚠ This website is an early version of the final product.</p>
                    </Warning>
                    {children}
                </div>
                <div className={styles.footer}>
                    <p>

                        This website uses cookies 🍪 <br />
                        <a href="https://www.developershouse.xyz/terms" target="_blank">
                            Learn more
                            </a>
                    </p>
                </div>
            </div>
        </div>
    )
};