import { useMutation } from "@apollo/react-hooks";
import { IonContent, IonGrid, IonPage } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SEND_MESSAGE from "../../graphql/messages/mutations/sendMessageMutation";
import { logMessage } from "../../redux/conversations/actions";
import { RootState } from "../../redux/reducers";
import { Conversation, Message, Profile } from "../../utils/types";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import Me from "./Me";
import Others from "./Others";

interface LocationState {
  name: string;
  recipientAddr: string;
  instanceId: string;
}

const ChatRoom: React.FC = () => {
  const [payload, setPayload] = useState<string>();
  const location = useLocation<LocationState>();
  const dispatch = useDispatch();

  const { name: id, instanceId, recipientAddr } = location.state;

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newMessage = {
        sender: me,
        payload: data?.sendMessage?.payload,
        createdAt: data?.sendMessage?.timestamp,
      };
      const conversation: Conversation = {
        name: id!,
        address: recipientAddr,
        instanceId,
        messages: [newMessage], // this should be the result from sendMessage
      };
      // BUG: new message is only being rendered when I type a new message.
      dispatch(logMessage(conversation));
      scrollToBottom();
    },
  });
  const content = useRef<HTMLIonContentElement>(null);

  const { messages, isContact } = useSelector((state: RootState) => ({
    messages: state.conversations.conversations.find(
      (conversation) => conversation.name === id
    )?.messages,
    isContact: state.contacts.contacts.some(
      (contact: Profile) => contact.id !== recipientAddr
    ),
  }));

  // this is not getting called when a new message is received.
  // useEffect(() => {
  //   setMessages(dispatch(getMessages(id)) as any);
  // }, [id]);

  const {
    profile: { username: me, id: myAddr },
  } = useSelector((state: RootState) => state.profile);

  const scrollToBottom = () => {
    content?.current?.scrollToBottom();
  };

  useEffect(scrollToBottom, [messages]);

  const sendNewMessage = async () => {
    await sendMessage({
      variables: {
        author: myAddr,
        recipient: recipientAddr,
        message: payload,
        properties: {
          id: instanceId,
          creator: null,
          conversant: null,
        },
      },
    });
    setPayload("");
  };

  return (
    <IonPage>
      <ChatHeader name={id!} isContact={isContact} />
      <IonContent ref={content} scrollEvents={true}>
        <IonGrid>
          {messages
            ? messages.map((message: Message) =>
                message.sender === me ? (
                  <Me key={JSON.stringify(message)} message={message} />
                ) : (
                  <Others key={JSON.stringify(message)} message={message} />
                )
              )
            : null}
        </IonGrid>
      </IonContent>

      <ChatFooter
        payload={payload}
        setPayload={setPayload}
        sendNewMessage={sendNewMessage}
      />
    </IonPage>
  );
};

export default ChatRoom;
