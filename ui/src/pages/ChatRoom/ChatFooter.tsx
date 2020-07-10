import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import { sendSharp } from "ionicons/icons";
import React from "react";
import styles from "./style.module.css";

interface Props {
  payload: string | undefined;
  setPayload(value: string): void;
  sendNewMessage(): void;
}

const ChatFooter: React.FC<Props> = ({ payload, setPayload, sendNewMessage }) => {
  return (
    <IonFooter>
      <IonToolbar className={styles.footer}>
        <IonTextarea
          autofocus
          placeholder="Type a message..."
          color="dark"
          rows={1}
          value={payload}
          onIonChange={(e) => setPayload(e.detail.value!)}
          className={styles["msg-input"]}
        />
        <IonButtons slot="end">
          <IonButton
            expand="full"
            fill="clear"
            disabled={payload ? false : true}
            color={payload ? "primary" : "medium"}
            className={`${styles["msg-btn"]}`}
            onClick={sendNewMessage}
          >
            <IonIcon icon={sendSharp} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
};

export default ChatFooter;
