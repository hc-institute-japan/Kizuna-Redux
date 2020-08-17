import { useMutation } from "@apollo/react-hooks";
import {
  IonButton,
  IonButtons,
  IonFooter,
  IonIcon,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, sendSharp } from "ionicons/icons";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import EDIT_MESSAGE from "../../graphql/messages/mutations/updateMessage";
import { updateMessage } from "../../redux/conversations/actions";
import { Conversation, Message } from "../../utils/types";
import styles from "./style.module.css";

interface Props {
  edit: Message;
  instanceId: string;
  setToEdit(message: Message | null): void;
  conversation: Conversation | undefined;
}

const ChatEditFooter: React.FC<Props> = ({
  instanceId,
  edit,
  setToEdit,
  conversation,
}) => {
  const { address: id, payload: message } = edit;
  const [editMessage] = useMutation(EDIT_MESSAGE);
  const [payload, setPayload] = useState("");
  const dispatch = useDispatch();
  const onClickHandler = async () => {
    const oldMessage = edit;
    const result = editMessage({
      variables: {
        instanceId,
        id,
        message: payload,
      },
    });
    setToEdit(null);
    dispatch(updateMessage({ ...edit, payload }, conversation));
  };
  return (
    <IonFooter>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton
            expand="full"
            fill="clear"
            onClick={() => {
              setToEdit(null);
              setPayload("");
            }}
          >
            <IonIcon icon={close} />
          </IonButton>
        </IonButtons>
        <IonTitle color="medium">{message}</IonTitle>
      </IonToolbar>
      <IonToolbar className={styles.footer}>
        <IonTextarea
          autofocus
          placeholder="Edit message..."
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
            onClick={onClickHandler}
          >
            <IonIcon icon={sendSharp} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonFooter>
  );
};

export default ChatEditFooter;
