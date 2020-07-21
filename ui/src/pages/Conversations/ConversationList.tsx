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
    {conversations.map((conversation) => (
      <ConversationItem
        key={JSON.stringify(conversation)}
        name={conversation.name}
        messages={conversation.messages}
      />
    ))}
  </IonList>
);

export default ConversationList;
