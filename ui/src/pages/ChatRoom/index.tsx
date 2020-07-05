import { IonContent, IonGrid, IonPage } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { logMessage, getMessages } from "../../redux/conversations/actions";
import { RootState } from "../../redux/reducers";
import { getTimestamp } from "../../utils/helpers/index";
import { Conversation, Message } from "../../utils/types";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import Me from "./Me";
import Others from "./Others";

interface LocationState {
  name: string;
  messages: Array<Message>;
}

const ChatRoom: React.FC = () => {
  const [newMsg, setNewMsg] = useState<string>();
  const location = useLocation<LocationState>();
  const dispatch = useDispatch();
  const id = location.state.name;
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    setMessages(dispatch(getMessages(id)) as any);
  }, [id]);

  const {
    profile: { username: me },
  } = useSelector((state: RootState) => state.profile);

  const scrollToBottom = () => {
    document.querySelector("ion-content")!.scrollToBottom();
  };

  const sendNewMessage = () => {
    const newMessage = {
      sender: me,
      payload: newMsg!,
      createdAt: getTimestamp(),
    };
    const conversation: Conversation = {
      name: id!,
      messages: [newMessage],
    };
    dispatch(logMessage(conversation));
    setMessages((curr) => [...curr, newMessage]);
    setNewMsg("");
    scrollToBottom();
  };

  return (
    <IonPage>
      <ChatHeader name={id!} />
      <IonContent scrollEvents={true}>
        <IonGrid>
          {messages.map((message) =>
            message.sender === me ? (
              <Me key={JSON.stringify(message)} message={message} />
            ) : (
              <Others key={JSON.stringify(message)} message={message} />
            )
          )}
        </IonGrid>
      </IonContent>

      <ChatFooter
        newMsg={newMsg}
        setNewMsg={setNewMsg}
        sendNewMessage={sendNewMessage}
      />
    </IonPage>
  );
};

export default ChatRoom;
