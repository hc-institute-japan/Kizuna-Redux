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

const Others: React.FC<Props> = ({ message }) => {
  return (
    <IonRow>
      <IonCol className="ion-no-padding" size="11">
        <div className={`${styles["other-message"]} ${styles["message"]}`}>
          <IonText>
            <p>{message.payload}</p>
          </IonText>
          <div className={`${styles["time"]}`}>
            {getProperTimestamp(message.createdAt)}
          </div>
        </div>
      </IonCol>
    </IonRow>
  );
};

export default Others;
