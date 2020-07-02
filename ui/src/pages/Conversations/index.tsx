import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonPage,
} from "@ionic/react";
import { pencil } from "ionicons/icons";
import React from "react";
import { useSelector } from "react-redux";
import HomeHeader from "../../components/Header/HomeHeader";
import { RootState } from "../../redux/reducers";
import ConversationList from "./ConversationList";
import styles from "./style.module.css";
import { useHistory } from "react-router";

const Conversations: React.FC = () => {
  const history = useHistory();
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

  // console.log(profile);

  return (
    <IonPage>
      <HomeHeader />
      <IonContent>
        <ConversationList conversations={conversations} />
      </IonContent>
      <IonFab
        onClick={() => history.push("/new-message")}
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
