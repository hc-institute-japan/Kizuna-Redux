import { IonAvatar, IonItem, IonLabel, IonNote, IonText } from "@ionic/react";
import Moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom";
import { Message } from "../../utils/types";
import styles from "./style.module.css";

type ConversationItemProps = {
  name: {
    username: string;
  };
  recipientAddr: string;
  messages: Array<Message>;
  instanceId: string;
};

const ConversationItem: React.FC<ConversationItemProps> = ({
  name,
  messages,
  recipientAddr,
  instanceId,
}: ConversationItemProps) => {
  const history = useHistory();

  const currMsg: { createdAt: number; payload: string } = messages
    .slice(-1)
    .pop() || { createdAt: 0, payload: "" };

  const handleOnClick = () =>
    history.push(`/chat-room/${name.username}`, {
      name: name.username,
      messages,
      recipientAddr,
      instanceId,
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
            <IonText color="dark">{name.username}</IonText>
          </strong>
        </h2>
        <p className="ion-text-nowrap">
          <IonText color="medium">{currMsg?.payload}</IonText>
        </p>
      </IonLabel>
      <IonNote slot="end" className="ios hydrated">
        <p className="ion-no-margin">{Moment(currMsg?.createdAt).fromNow()}</p>
        <div className={styles.badge}>50</div>
      </IonNote>
    </IonItem>
  );
};

export default ConversationItem;
