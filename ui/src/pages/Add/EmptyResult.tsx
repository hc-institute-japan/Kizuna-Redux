import React from "react";
import styles from "./style.module.css";
import { IonIcon, IonText } from "@ionic/react";
import { sadOutline } from "ionicons/icons";

const EmptyResult = () => {
  return (
    <div className={styles.center}>
      <IonIcon className={styles.icon} icon={sadOutline}></IonIcon>
      <IonText>
        <h4>No person with this username.</h4>
      </IonText>
    </div>
  );
};

export default EmptyResult;
