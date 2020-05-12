import React from "react";
import { IonButton } from "@ionic/react";
import styles from "./style.module.css";

const Button: React.FC = (props) => (
  <IonButton color="primary" className={styles.button} {...props}>
    {props.children}
  </IonButton>
);

export default Button;
