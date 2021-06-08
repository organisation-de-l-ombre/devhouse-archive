import React, { ReactNode } from "react";
import styles from "./centered-message.module.scss";

const CenteredMessage: React.FC<{
  title: ReactNode;
}> = ({ children, title }) => {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.container}>
        <h1>{title}</h1>
        <hr />
        {children}
      </div>
    </div>
  );
};

export default CenteredMessage;
