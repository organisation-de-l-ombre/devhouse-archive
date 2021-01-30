import { AiOutlineLoading } from "react-icons/ai";
import React from "react";
import FlexContainer from "../FlexContainer/FlexContainer";
import flexContainerStyles from "../FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Suspense.module.scss";

const Suspense = (): React.ReactElement => {
  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles.column} ${globalStyles["alignment-full-center"]}`}
    >
      <div className={styles.suspense}>
        <AiOutlineLoading
          className={globalStyles["rotate-infinite-animation"]}
        />
        <h2 className={globalStyles["text-align-center"]}>
          Loading the ressource you requested...
        </h2>
      </div>
    </FlexContainer>
  );
};

export default Suspense;
