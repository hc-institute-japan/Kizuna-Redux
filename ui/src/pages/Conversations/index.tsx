import { IonPage, IonFab, IonContent, IonFabButton, IonIcon, IonModal } from "@ionic/react";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import HomeHeader from "../../components/Header/HomeHeader";
import { RootState } from "../../redux/reducers";
import ConversationList from "./ConversationList";
import { pencil } from "ionicons/icons";
import styles from "./style.module.css";
import NewConversationModal from "./modal/NewConversationModal";

const Conversations: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const { conversations } = useSelector((state: RootState) => state.conversations);

  // console.log(profile);

  return (
    <IonPage>
      <HomeHeader />
      <IonContent>
        <ConversationList conversations={conversations} />
      </IonContent>
      <IonContent>
        <IonModal isOpen={showModal}>
          <NewConversationModal setShowModal={setShowModal}/>
        </IonModal>
      </IonContent>
      <IonFab
        onClick={() => setShowModal(true)}
        vertical="bottom"
        horizontal="end"
        slot="fixed"
      >
        <IonFabButton>
          <IonIcon className={`${styles["fab-icon"]}`} icon={pencil} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Conversations;
