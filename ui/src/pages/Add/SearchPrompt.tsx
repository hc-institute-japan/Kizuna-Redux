import React from "react";
import styles from "./style.module.css";
import { IonIcon, IonText } from "@ionic/react";
import { searchOutline } from "ionicons/icons";

const SearchPrompt = () => {
  return (
    <div className={styles.center}>
      <IonIcon icon={searchOutline} className={styles.icon}></IonIcon>
      <IonText>
        <h4 className={styles.text}>Search the person you want to add</h4>
      </IonText>
    </div>
  );
};

export default SearchPrompt;
