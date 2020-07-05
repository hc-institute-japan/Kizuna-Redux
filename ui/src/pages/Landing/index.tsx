import { IonButton, IonText } from "@ionic/react";
import React from "react";
import styles from "./style.module.css";

const Landing = () => {
  // useEffect(() => {
  //   connect({ url: "ws://localhost:8888" }).then(
  //     ({ callZome, close, onSignal }) => {
  //       onSignal((signal) => {
  //         console.log(signal);
  //       });
  //     }
  //   );
  // }, []);

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
