import React from "react";
import {
  IonFooter,
  IonToolbar,
  IonTextarea,
  IonButtons,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { sendSharp } from "ionicons/icons";
import styles from "./style.module.css";
import sendMessage from "../../graphql/messages/mutations/sendMessage";

interface Props {
  newMsg: string | undefined;
  setNewMsg(value: string): void;
  sendNewMessage(): void;
}

const ChatFooter: React.FC<Props> = ({ newMsg, setNewMsg, sendNewMessage }) => {
  return (
    <IonFooter>
      <IonToolbar className={styles.footer}>
        <IonTextarea
          autofocus
          placeholder="Type a message..."
          color="dark"
          rows={1}
          value={newMsg}
          onIonChange={(e) => setNewMsg(e.detail.value!)}
          className={styles["msg-input"]}
        />
        <IonButtons slot="end">
          <IonButton
            expand="full"
            fill="clear"
            disabled={newMsg ? false : true}
            color={newMsg ? "primary" : "medium"}
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
