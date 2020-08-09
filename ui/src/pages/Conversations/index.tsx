import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonModal,
  IonPage,
} from "@ionic/react";
import { pencil } from "ionicons/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import HomeHeader from "../../components/Header/HomeHeader";
import ListItem from "../../components/Item";
import List from "../../components/List";
import { RootState } from "../../redux/reducers";
import NewConversationModal from "./modal/NewConversationModal";
import styles from "./style.module.css";

const Conversations: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

  const [isMultiselect, setIsMultiselect] = useState(true);

  return (
    <IonPage>
      <HomeHeader isMultiselect={isMultiselect} />
      <IonContent>
        {/* <ConversationList conversations={conversations} /> */}
        <List
          isMultiselect={(bool: boolean) => setIsMultiselect(bool)}
          onClick={(i: number) => {}}
          onMultiselectClick={(i: number) => {}}
        >
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem onClick={(i: number) => {}}>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Neil
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon
              Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon
              Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon Snow Jon
              Snow Jon Snow Jon Snow Jon Snow Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>

          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
          <ListItem>
            <IonLabel className="sc-IonLabel-ios-h sc-IonLabel-ios-s ios hydrated">
              Jon Snow
            </IonLabel>
          </ListItem>
        </List>
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
