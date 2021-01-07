import React from "react";
import globalStyles from "../../styles/Global.module.scss";
import styles from "./NotImplemented.module.scss";
import { Card, CardPadding } from "../../components/ui/Card/Card";
import catKeyboard from "../../assets/pictures/cat_keyboard.gif";
import { Text } from "../../components/ui/Text/Text";

export default function NotFound(): React.ReactElement {
  return (
    <div className={globalStyles["container-full"]}>
      <Card className={styles["content-container"]}>
        <CardPadding>
          <div className={styles["picture-container"]}>
            <img
              src={catKeyboard}
              alt="A cat typing on a keyboard"
              draggable={false}
              className={globalStyles["picture-rounded"]}
            />
            <Text className={styles.text}>Coming soon...</Text>
          </div>
          <hr />
          <Text className={styles.content}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            But what's going on? Eh yes, we are working on a new feature! Be
            patient, it will arrive happen very soon...
          </Text>
        </CardPadding>
      </Card>
    </div>
  );
}
