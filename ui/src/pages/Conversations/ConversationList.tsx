import React from "react";
import { IonItemGroup } from "@ionic/react";
import ConversationItem from "./ConversationItem";
import { Conversation } from "../../utils/types";

type ConversationListProps = {
  conversations: Array<Conversation>;
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
}: ConversationListProps) => (
  <IonItemGroup>
    {conversations.map((conversation) => (
      <ConversationItem
        key={conversation.name}
        name={conversation.name}
        messages={conversation.messages}
      />
    ))}
  </IonItemGroup>
);

export default ConversationList;
