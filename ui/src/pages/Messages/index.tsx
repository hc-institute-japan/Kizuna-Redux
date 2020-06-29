import { IonPage, IonItem, IonAvatar, IonLabel, IonContent } from "@ionic/react";
import { useSelector } from "react-redux";
import React, { useEffect } from "react";
import HomeHeader from "../../components/Header/HomeHeader";
import { RootState } from "../../redux/reducers";
import MessageList from "./MessageList";

const Messages: React.FC = () => {
  const { messages } = useSelector(
    (state: RootState) => state.messages
  );
  const { profile } = useSelector(
    (state: RootState) => state.profile
  );
  
  return (
    <IonPage>
      <HomeHeader />
      <IonContent>
        <MessageList messages={messages} profile={profile}/>
      </IonContent>
    </IonPage>
  )
}

export default Messages;