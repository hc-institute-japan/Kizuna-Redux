import { IonPage, IonFab, IonContent, IonFabButton, IonIcon } from "@ionic/react";
import { useSelector } from "react-redux";
import React from "react";
import { useHistory } from "react-router-dom";
import HomeHeader from "../../components/Header/HomeHeader";
import { RootState } from "../../redux/reducers";
import ConversationList from "./ConversationList";
import { pencil } from "ionicons/icons";
import styles from "./style.module.css"

const Conversations: React.FC = () => {
  const history = useHistory();
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );
  
  return (
    <IonPage>
      <HomeHeader />
      <IonContent>
        <ConversationList conversations={conversations}/>
      </IonContent>
      <IonFab
        onClick={() => history.push("/new-message")}
        vertical="bottom"
        horizontal="end"
        slot="fixed"
      >
        <IonFabButton>
          <IonIcon className={`${styles['fab-icon']}`} icon={pencil}  />
        </IonFabButton>
      </IonFab>
    </IonPage>
  )
}

export default Conversations;