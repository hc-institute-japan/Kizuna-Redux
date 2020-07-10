import { IonButton, IonText } from "@ionic/react";
import React, { useEffect } from "react";
import { onSignal } from "../../connection/holochainClient";
import styles from "./style.module.css";

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
