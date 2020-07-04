import React, { useEffect, useState } from "react";
import {
  IonItem,
  IonAvatar,
  IonBadge,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Message } from "../../utils/types";
import styles from "./style.module.css";

type ConversationItemProps = {
  name: string;
  messages: Array<Message>;
  me?: string;
};

const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  messages,
}: ConversationItemProps) => {
  const [recentMsg, setRecentMsg] = useState("");
  const history = useHistory();

  const getRecentMsg = (msgs: Array<Message>) => {
    let currMsg: Message = {
      sender: "",
      payload: "",
      createdAt: 0,
    };
    msgs.forEach((msg) => {
      if (!currMsg || (currMsg && msg.createdAt > currMsg.createdAt))
        currMsg = msg;
    });
    setRecentMsg(currMsg.payload);
  };

  useEffect(() => {
    getRecentMsg(messages);
  }, [messages]);

  return (
    <IonItem
      lines="none"
      className={styles["conversation-item"]}
      button
      onClick={() =>
        history.push(`/chat-room/${name}`, {
          name,
          messages: [...messages],
        })
      }
    >
      <IonAvatar slot="start">
        <img
          src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
          alt=""
        />
      </IonAvatar>
      <IonGrid>
        <IonRow className={styles["row"]}>
          <IonCol size="8" className={styles["col"]}>
            <h4 className={styles["conversation-item-name"]}>{name}</h4>
          </IonCol>

          <IonCol size="4" className={styles["col"]}>
            <h3 className={styles["time"]}>Just Now</h3>
          </IonCol>
        </IonRow>

        <IonRow className={styles["row"]}>
          <IonCol size="8" className={styles["col"]}>
            <b className={styles["recent-message"]}>{recentMsg}</b>
          </IonCol>

          <IonCol size="4" className={styles["col"]}>
            <IonBadge className={styles["badge"]}>1</IonBadge>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default ConversationItem;
