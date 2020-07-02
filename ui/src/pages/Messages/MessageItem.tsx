import {
  IonAvatar,
  IonBadge,
  IonCol,
  IonGrid,
  IonItem,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Conversation, Message } from "../../utils/types";
import styles from "./style.module.css";

type MessageItemProps = {
  name: string;
  contents: Array<Message>;
  me: string;
};

const MessageItem: React.FC<MessageItemProps> = ({
  name,
  contents,
  me,
}: MessageItemProps) => {
  const [recentMsg, setRecentMsg] = useState("");
  const history = useHistory();

  const getRecentMsg = (contents: Array<Message>) => {
    let currContent: Message = {
      sender: "",
      payload: "",
      createdAt: 0,
    };
    contents.forEach((content) => {
      if (
        !currContent ||
        (currContent && content.createdAt > currContent.createdAt)
      )
        currContent = content;
    });
    setRecentMsg(currContent.payload);
  };

  useEffect(() => {
    getRecentMsg(contents);
  }, [contents]);

  return (
    <IonItem
      lines={"none"}
      className={`${styles["message-item"]}`}
      button
      onClick={() =>
        history.push(`/chat-room/${name}`, {
          me,
          name,
          contents,
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
        <IonRow className={`${styles["row"]}`}>
          <IonCol size={"8"} className={`${styles["col"]}`}>
            <h4 className={`${styles["message-item-name"]}`}>{name}</h4>
          </IonCol>

          <IonCol size={"4"} className={`${styles["col"]}`}>
            <h3 className={`${styles["time"]}`}>Just Now</h3>
          </IonCol>
        </IonRow>

        <IonRow className={`${styles["row"]}`}>
          <IonCol size={"8"} className={`${styles["col"]}`}>
            <b className={`${styles["recent-message"]}`}>{recentMsg}</b>
          </IonCol>

          <IonCol size={"4"} className={`${styles["col"]}`}>
            <IonBadge className={`${styles["badge"]}`}>1</IonBadge>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default MessageItem;
