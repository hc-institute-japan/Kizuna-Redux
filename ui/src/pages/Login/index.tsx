import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import React, { useState } from "react";
import styles from "./style.module.css";
/**
 * @name Login
 *
 * The user will be redirected to login or signup depending on if the user has an account or not
 */
const Login: React.SFC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleOnSubmit = () => {
    const isRegistered = true;
    history.push({
      pathname: `/${isRegistered ? "register" : "complete"}`,
      state: {
        email,
      },
    });
  };

  const handleOnChange = (e: any) => {
    const string = e.target.value.trim();
    setIsEmailValid(
      //eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(e.target.value).toLowerCase()
      )
    );
    setEmail(string);
  };

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
              onIonChange={handleOnChange}
              placeholder="john@address.com"
            ></IonInput>
          </IonCol>
        </IonRow>
        <IonButton
          onClick={handleOnSubmit}
          disabled={!isEmailValid}
          className={styles.Next}
        >
          Next
        </IonButton>
      </div>
    </IonContent>
  );
};

export default withRouter(Login);
