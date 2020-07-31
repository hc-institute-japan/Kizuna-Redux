import { IonList } from "@ionic/react";
import React from "react";
import { Conversation } from "../../utils/types";
import ConversationItem from "./ConversationItem";
import styles from "./style.module.css";

type ConversationListProps = {
  conversations: Array<Conversation>;
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
}: ConversationListProps) => (
  <IonList color="light" className={styles["conversation-list"]}>
    {conversations.map((conversation, i) => (
      <ConversationItem
        key={JSON.stringify(conversation)}
        name={{ username: conversation.name }}
        recipientAddr={conversation.address}
        messages={conversation.messages}
        instanceId={conversation.instanceId}
      />
    ))}
  </IonList>
);

export default ConversationList;
