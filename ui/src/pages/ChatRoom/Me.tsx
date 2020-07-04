import React from "react";
import { IonRow, IonCol, IonText } from "@ionic/react";
import styles from "./style.module.css";
import { Message } from "../../utils/types";

interface Props {
  message: Message;
}

const getProperTimestamp = (timestamp: number) => {
  const originalTimeStamp = timestamp * 1000;
  const d = new Date(originalTimeStamp);
  return d.toLocaleString();
};
const Me: React.FC<Props> = ({ message }) => {
  return (
    <IonRow>
      <IonCol
        className={`ion-no-padding ion-justify-content-end ${styles["my-message-container"]}`}
        size="11"
        offset="1"
      >
        <div>
          <div
            className={`${styles["my-message"]} ${styles["message"]} ion-padding-start ion-justify-content-end`}
          >
            <IonText>
              <p className="ion-text-start">{message.payload}</p>
            </IonText>
            <div className={`${styles["time"]}`}>
              {getProperTimestamp(message.createdAt)}
            </div>
          </div>
        </div>
      </IonCol>
    </IonRow>
  );
};

export default Me;
