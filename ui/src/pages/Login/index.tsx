import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { withRouter } from "react-router-dom";
import React, { useState } from "react";
import styles from "./style.module.css";

const Login = ({ history }: { history: any }) => {
  const [email, setEmail] = useState("");

  const handleOnSubmit = () => {
    const isRegistered = true;
    history.push({
      pathname: `/${isRegistered ? "register" : "complete"}`,
      state: {
        email,
      },
    });
  };

  /**
   * @name Login
   *
   * The user will be redirected to login or signup depending on if the user has an account or not
   */

  return (
    <IonContent>
      <div className={styles.Login}>
        <IonLabel>
          <h2>Email</h2>
        </IonLabel>
        <IonRow className={`${styles.LoginInput} ion-justify-content-center`}>
          <IonCol>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              placeholder="john@address.com"
            ></IonInput>
          </IonCol>
        </IonRow>
        <IonButton onClick={handleOnSubmit} className={styles.Next}>
          Next
        </IonButton>
      </div>
    </IonContent>
  );
};

export default withRouter(Login);
