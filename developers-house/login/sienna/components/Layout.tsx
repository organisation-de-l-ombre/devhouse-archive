import styles from '../styles/Layout.module.scss';

export const Layout: React.FC = ({ children }) => {
    return (
        <div className={styles.app}>
            <div className={styles.card}>
                <div className={styles.header}>{ } | Login</div>

                <div className={styles.content}>
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