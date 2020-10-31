import React from "react";
import { IonItemGroup } from "@ionic/react";
import MessageItem from "./MessageItem";
import { Message, Profile, Conversation } from "../../utils/types";

type MessageListProps = {
  messages: Array<any>;
  profile: Profile;
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  profile,
}: MessageListProps) => {
  return (
    <IonItemGroup>
      {messages.map((message) => (
        <MessageItem
          me={profile.username}
          name={message.name}
          contents={message.contents}
        />
      ))}
    </IonItemGroup>
  );
};

export default MessageList;
