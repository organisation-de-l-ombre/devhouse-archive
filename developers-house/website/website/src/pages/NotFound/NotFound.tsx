import React, { ReactElement, useEffect, useRef } from "react";
import Button from "components/ui/Button/Button";
import { useHistory } from "react-router";
import styles from "./not-found.module.scss";

export default function NotFound(): ReactElement {
  const nav = useHistory();
  const eggRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eggRef.current) {
      eggRef.current.innerHTML +=
        "<!-- Yo, androz sait dev, gg t'a trouvé le mot de passe -->";
    }
  }, [eggRef]);

  return (
    <div ref={eggRef} className={styles["not-found"]}>
      <div className={styles.container}>
        <h1>404</h1>
        <hr />
        <h2>Not found - This page doesn&#39;t exists</h2>
        <p>We couldn&#39;t find this page on this application.</p>
        <Button onClick={() => nav.push("/")}>Return home</Button>
      </div>
    </div>
  );
}
