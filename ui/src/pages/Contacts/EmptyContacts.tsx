import React from "react";
import styles from "./style.module.css";
import { IonText, IonIcon } from "@ionic/react";
import { sadOutline } from "ionicons/icons";

const EmptyContacts = () => {
  return (
    <div className={styles.center}>
      <IonIcon className={styles["empty-sad"]} icon={sadOutline}></IonIcon>
      <IonText color="dark">
        <h4>You have no contacts... yet</h4>
      </IonText>
    </div>
  );
};

export default EmptyContacts;
