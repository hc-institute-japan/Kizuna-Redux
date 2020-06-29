import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  IonPage, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonContent, 
  IonFooter, 
  IonToolbar, 
  IonTextarea,
  IonIcon, 
  IonButton } from "@ionic/react";
import { sendSharp } from "ionicons/icons";
import { useLocation, useParams } from "react-router-dom";
import { logMessage } from "../../redux/messages/actions";
import ChatHeader from "./ChatHeader";
import { MessageContent, Message } from "../../utils/types";
import { getTimestamp } from "../../utils/helpers/index";
import styles from "./style.module.css";
import { RootState } from "../../redux/reducers";


const ChatRoom: React.FC = () => {
  const location: any = useLocation();
  const { id } = useParams();
  const [contents, setContents] = useState<Array<MessageContent>>([]);
  const [currentUser, setCurrentuser] = useState<string>("");
  const [me, setMe] = useState<string>("");
  const [newMsg, setNewMsg] = useState<string>();
  const dispatch = useDispatch();
  const { messages } = useSelector(
    (state: RootState) => state.messages
  );

  const getContent = () => {
    return document.querySelector('ion-content');
  }

  const scrollToBottom = () => {
    getContent()!.scrollToBottom();
  }

  const sendNewMessage = () => {
    const newMessage: Message = {
      name: id!,
      contents: [{
        sender: me,
        payload: newMsg!,
        createdAt: getTimestamp(),
      }]
    };
    dispatch(logMessage(newMessage));
    setNewMsg("");
    scrollToBottom();
  }

  useEffect(() => {
    //TODO: if location.state.contents is null then fetch message from the hc then push to redux state
    setContents(location.state.contents);
    setCurrentuser(id!);
    setMe(location.state.me)
  }, [location, id]);

  useEffect(() => {
    const c: Message | undefined = messages.find((message) => {
      return message.name === id!
    });
    if (c) setContents(c.contents)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ messages ])
  
  // temporary timestamp function
  const getProperTimestamp = (timestamp: number) => {
    const originalTimeStamp = timestamp * 1000;
    const d = new Date(originalTimeStamp);
    return d.toLocaleString();
  };

  return (
    <IonPage>
      <ChatHeader name={id!}/>
      <IonContent scrollEvents={true} >
        <IonGrid>
          {contents.map(content => {
            return content.sender !== currentUser ? 
            (
              <IonRow>
                <IonCol offset={"3"} size={"9"} className={`${styles['my-message']} ${styles['message']}`}>
                  <b>{content.sender}</b><br/>
                  <span>{content.payload}</span>
                  <div className={`${styles['time']}`} ><br/>
                    {getProperTimestamp(content.createdAt)}
                  </div>
                </IonCol>
              </IonRow>
            ) : (
              <IonRow>
                <IonCol size={"9"} class={`${styles['other-message']} ${styles['message']}`}>
                  <b>{content.sender}</b><br/>
                  <span>{content.payload}</span>
                  <div className={`${styles['time']}`} ><br/>
                    {getProperTimestamp(content.createdAt)}
                  </div>
                </IonCol>
              </IonRow>
            )}
          )}
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar color={"light"}>
          <IonRow className={`${styles['footer']}`} >
              <IonCol size={"10"} >
                <IonTextarea
                  autofocus
                  placeholder={"Type a message..."} 
                  rows={1}
                  value={newMsg} 
                  onIonChange={e => setNewMsg(e.detail.value!)}
                  className={`${styles['msg-input']}`}
                />
              </IonCol>
              <IonCol size={"2"} style={{padding: "0px"}}>
                <IonButton 
                  expand={"full"}
                  fill={"clear"}
                  disabled={newMsg ? false : true } 
                  className={`${styles['msg-btn']}`} 
                  style={{
                    padding: "0px !important",
                  }}
                  onClick={() => {
                    sendNewMessage();
                 }}>
                  <IonIcon icon={sendSharp} />
                </IonButton>
              </IonCol>
          </IonRow> 
        </IonToolbar>
      </IonFooter>
    </IonPage>
)
}

export default ChatRoom;