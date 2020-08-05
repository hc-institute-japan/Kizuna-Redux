import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonPage,
} from "@ionic/react";
import { pencil } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import HomeHeader from "../../components/Header/HomeHeader";
import { RootState } from "../../redux/reducers";
import ConversationList from "./ConversationList";
import NewConversationModal from "./modal/NewConversationModal";
import styles from "./style.module.css";

const Conversations: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

  return (
    <IonPage>
      <HomeHeader />
      <IonContent>
        <ConversationList conversations={conversations} />
        <IonModal isOpen={showModal}>
          <NewConversationModal
            setShowModal={setShowModal}
            conversations={conversations}
          />
        </IonModal>
        <IonFab
          onClick={() => setShowModal(true)}
          vertical="bottom"
          horizontal="end"
          slot="fixed"
        >
          <IonFabButton>
            <IonIcon className={styles["fab-icon"]} icon={pencil} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Conversations;
