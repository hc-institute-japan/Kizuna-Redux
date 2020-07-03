import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import { sendSharp } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, RouteComponentProps } from "react-router-dom";
import { logMessage } from "../../redux/conversations/actions";
import { RootState } from "../../redux/reducers";
import { getTimestamp } from "../../utils/helpers/index";
import { Conversation, Message } from "../../utils/types";
import ChatHeader from "./ChatHeader";
import styles from "./style.module.css";

interface LocationProps {
  messages: Array<Message> | [];
}

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [currentUser, setCurrentUser] = useState<string>("");
  const [me, setMe] = useState<string>("");
  const [newMsg, setNewMsg] = useState<string>();

  const { id } = useParams();
  const location = useLocation<LocationProps>();

  const dispatch = useDispatch();

  // const { conversations } = useSelector(
  //   (state: RootState) => state.conversations
  // );

  const { profile } = useSelector((state: RootState) => state.profile);

  const scrollToBottom = () => {
    document.querySelector("ion-content")!.scrollToBottom();
  };

  const sendNewMessage = () => {
    const newMessage: Conversation = {
      name: id!,
      messages: [
        {
          sender: me,
          payload: newMsg!,
          createdAt: getTimestamp(),
        },
      ],
    };
    dispatch(logMessage(newMessage));
    setNewMsg("");
    scrollToBottom();
  };

  useEffect(() => {
    //TODO: if location.state.contents is null then fetch message from the hc then push to redux state

    if (location?.state?.messages) {
      setMessages(location?.state?.messages);
    }
    setCurrentUser(id!);
    setMe(profile.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, id, profile]);

  // useEffect(() => {
  //   const conversation: Conversation | undefined = conversations.find((conversation) => {
  //     console.log(id);
  //     console.log(conversation.name);
  //     return conversation.name === id!
  //   });
  //   if (conversation) setMessages(conversation.messages)
  //   console.log("Hey!");
  // }, [conversations])

  // temporary timestamp function
  const getProperTimestamp = (timestamp: number) => {
    const originalTimeStamp = timestamp * 1000;
    const d = new Date(originalTimeStamp);
    return d.toLocaleString();
  };

  return (
    <IonPage>
      <ChatHeader name={id!} />
      <IonContent scrollEvents={true}>
        <IonGrid>
          {messages.map((message) => {
            return message.sender !== currentUser ? (
              <IonRow>
                <IonCol
                  offset={"3"}
                  size={"9"}
                  className={`${styles["my-message"]} ${styles["message"]}`}
                >
                  <b>{message.sender}</b>
                  <br />
                  <span>{message.payload}</span>
                  <div className={`${styles["time"]}`}>
                    <br />
                    {getProperTimestamp(message.createdAt)}
                  </div>
                </IonCol>
              </IonRow>
            ) : (
              <IonRow>
                <IonCol
                  size={"9"}
                  class={`${styles["other-message"]} ${styles["message"]}`}
                >
                  <b>{message.sender}</b>
                  <br />
                  <span>{message.payload}</span>
                  <div className={`${styles["time"]}`}>
                    <br />
                    {getProperTimestamp(message.createdAt)}
                  </div>
                </IonCol>
              </IonRow>
            );
          })}
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar color={"light"}>
          <IonRow className={`${styles["footer"]}`}>
            <IonCol size={"10"}>
              <IonTextarea
                autofocus
                placeholder={"Type a message..."}
                rows={1}
                value={newMsg}
                onIonChange={(e) => setNewMsg(e.detail.value!)}
                className={`${styles["msg-input"]}`}
              />
            </IonCol>
            <IonCol size={"2"}>
              <IonButton
                expand={"full"}
                fill={"clear"}
                disabled={newMsg ? false : true}
                className={`${styles["msg-btn"]}`}
                onClick={() => {
                  sendNewMessage();
                }}
              >
                <IonIcon icon={sendSharp} />
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatRoom;
