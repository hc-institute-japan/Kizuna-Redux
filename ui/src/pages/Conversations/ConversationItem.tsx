import { IonAvatar, IonItem, IonText, IonLabel, IonNote } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Message } from "../../utils/types";
import styles from "./style.module.css";

type ConversationItemProps = {
  name: string,
  recipientAddr: string,
  messages: Array<Message>,
  instanceId: string,
};

const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  messages,
  recipientAddr,
  instanceId,
}: ConversationItemProps) => {
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
    return currMsg.payload;
  };

  useEffect(() => {
    getRecentMsg(messages);
  }, [messages]);

  const handleOnClick = () =>
    history.push(`/chat-room/${name}`, {
      name,
      messages: [...messages],
    });

  return (
    <IonItem
      className={`item ios in-list ion-focusable item-label hydrated ${styles["conversation-item"]}`}
      lines="none"
      color="none"
      button
      onClick={handleOnClick}
    >
      <IonAvatar slot="start" class="ios hydrated">
        <img
          src="https://pbs.twimg.com/profile_images/831775643432001537/vrmO1ndW.jpg"
          /* src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"*/
          alt=""
        />
      </IonAvatar>
      <IonLabel className="sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated">
        <h2>
          <strong>
            <IonText color="dark">{name}</IonText>
          </strong>
        </h2>
        <p className="ion-text-nowrap">
          <IonText color="medium">{recentMsg}</IonText>
        </p>
      </IonLabel>
      <IonNote slot="end" className="ios hydrated">
        <p className="ion-no-margin">Just Now</p>
        <div className={styles.badge}>50</div>
      </IonNote>
    </IonItem>
  );
};
// <IonItem
//   lines="none"
//   button
//   color="none"
//   onClick={handleOnClick}
//   className={`item ios in-list ion-focusable item-label hydrated ${styles["conversation-item"]}`}
// >
//   <IonAvatar slot="start" class="ios hydrated">
//     <img
//       src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
//       alt=""
//     />
//   </IonAvatar>

//   <IonLabel
//     slot="start"
//     className={`sc-ion-label-ios-h sc-ion-label-ios-s ios hydrated ${styles["message-details"]}`}
//   >
//     <IonText color="dark">
//       <h2>
//         <strong>{name}</strong>
//       </h2>
//     </IonText>
//     <IonText color="medium">
//       <p className="ion-text-nowrap">
//         {recentMsg} {recentMsg} {recentMsg} {recentMsg} {recentMsg}{" "}
//         {recentMsg} {recentMsg} {recentMsg} {recentMsg} {recentMsg}{" "}
//         {recentMsg} {recentMsg}
//       </p>
//     </IonText>
//   </IonLabel>

//   <IonNote slot="end">xd</IonNote>
// </IonItem>

{
  /* <IonItem
      className={styles["conversation-item"]}
      button
      onClick={() =>
        history.push(`/chat-room/${name}`, {
          name,
          recipientAddr,
          instanceId,
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
            <b className={styles["recent-message"]}>{getRecentMsg(messages)}</b>
          </IonCol>

          <IonCol size="4" className={styles["col"]}>
            <IonBadge className={styles["badge"]}>1</IonBadge>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem> */
}
export default ConversationItem;
