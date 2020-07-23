import { IonContent, IonGrid, IonPage } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { logMessage, getMessages } from "../../redux/conversations/actions";
import { RootState } from "../../redux/reducers";
import { getTimestamp } from "../../utils/helpers/index";
import { Conversation, Message } from "../../utils/types";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import Me from "./Me";
import Others from "./Others";
import SEND_MESSAGE from "../../graphql/messages/mutations/sendMessageMutation";

interface LocationState {
  name: string;
  recipientAddr: string,
  instanceId: string,
}

const ChatRoom: React.FC = () => {
  const [payload, setPayload] = useState<string>();
  const location = useLocation<LocationState>();
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newMessage = {
        sender: me,
        payload: data?.sendMessage?.payload,
        createdAt: data?.sendMessage?.timestamp,
      };
      setMessages((curr) => [...curr, newMessage]);
      const conversation: Conversation = {
        name: id!,
        address: recipientAddr,
        instanceId: instanceId,
        messages: [newMessage], // this should be the result from sendMessage
      };
      dispatch(logMessage(conversation));
      scrollToBottom();
    },
  });
  const id = location.state.name;
  const instanceId = location.state.instanceId;
  const { recipientAddr } = location.state;

  useEffect(() => {
    setMessages(dispatch(getMessages(id)) as any);
  }, [id]);

  const {
    profile: { username: me, id: myAddr },
  } = useSelector((state: RootState) => state.profile);

  const scrollToBottom = () => {
    document.querySelector("ion-content")!.scrollToBottom();
  };

  const sendNewMessage = async () => {
    try {
      //needs to be changed.
      let finalPayload;
      finalPayload = payload;
      setPayload("");
      const sendResult = await sendMessage({
        variables: {
          author: myAddr,
          recipient: recipientAddr,
          message: finalPayload,
          properties: {
            id: instanceId,
            creator: null,
            conversant: null,
          }
        }
      });
      console.log(sendResult);
    } catch (e) {
      //pushErr
    }
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
        payload={payload}
        setPayload={setPayload}
        sendNewMessage={sendNewMessage}
      />
    </IonPage>
  );
};

export default ChatRoom;
