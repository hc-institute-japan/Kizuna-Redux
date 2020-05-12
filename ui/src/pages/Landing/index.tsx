import React from "react";
import styles from "./style.module.css";
import { IonText, IonButton } from "@ionic/react";

const Landing = () => {
  return (
    <div className={styles.Landing}>
       
      <IonText color="primary">
        <h1>Kizuna {"<Temporary>"}</h1>
      </IonText>
      <IonButton
        color="primary"
        className={styles.LandingButton}
        routerLink="/register"
      >
        Start Messaging
      </IonButton>
    </div>
  );
};

export default Landing;
